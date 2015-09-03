
(function()
{
    var Editor = function Editor() {}

    var myEditorTimeoutVar = null;

    Editor.changedEventTrap = function(e)
    {
        if( myEditorTimeoutVar )
        {
            window.clearTimeout(myEditorTimeoutVar);
        }
        myEditorTimeoutVar = window.setTimeout(Editor.changed, 200);
    }

    Editor.changed = function()
    {
        var editor = ace.edit("editor");
        var annotations = editor.getSession().getAnnotations();
    }

    Editor.initEditor = function()
    {
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/twilight");
        editor.getSession().setMode("ace/mode/json");
        Editor.aceEditor = editor;

        editor.getSession().on("changeAnnotation", Editor.changedEventTrap);

        editor.commands.addCommand(
        {
            name: 'saveFile',
            bindKey: {
                win: 'Ctrl-S',
                mac: 'Command-S',
                sender: 'editor|cli'
            },
            exec: function(env, args, request)
            {
                // Here's where we'd save
                // data: Editor.aceEditor.getSession().getValue(),
                // file_path: Editor.currentPath},
            }
        });
    }

    var TextEditViewApp = function(editorDiv, saveButton)
    {
        this.editorDiv = editorDiv;
        this.saveButton = saveButton;
    }

    TextEditViewApp.makeTextView = function(idName, className)
    {
        var elem = document.createElement('div');
        elem.id = idName;
        elem.classList.add(className);
        return elem;
    }

    TextEditViewApp.launch = function(loader, containerDiv, receiveApp)
    {
        var menuBar = $('<div style="display: inline-block; position: absolute; left:0px; right:0px; top:0px; height: 2em; line-height: 2em; background-color: #333; color:white;">').appendTo(containerDiv);
        var editorBody = $('<div style="display: inline-block; position: absolute; left:0px; right:0px; top:2em; bottom: 0px; background-color: black;">').appendTo(containerDiv);
        var editorDiv = TextEditViewApp.makeTextView("editor", "fill");
        var saveButton = $("<span>").css({cursor:'hand', verticalAlign:'middle',margin:'1em'}).html("Save");

        menuBar.append(saveButton);
        saveButton.css({color:"#555"});
        editorBody.append( editorDiv );

        loader.loadScripts([
            "ace/src-min/ace.js",
            "ace/src-min/ext-modelist.js",
            ],
            function()
            {
                Editor.initEditor();
                receiveApp(new TextEditViewApp(editorDiv, saveButton));
            }
        );
    }

    TextEditViewApp.prototype.open = function(fileAccess)
    {
        var modelist = ace.require("ace/ext/modelist");
        var editor = ace.edit("editor");
        var mode = modelist.getModeForPath(fileAccess.getPath()).mode;
        editor.getSession().setMode(mode);

        var thisApp = this;
        fileAccess.download(
            function( text )
            {
                Editor.aceEditor.getSession().setValue(text);
                thisApp.saveButton.css({color:"#eee"});
                thisApp.saveButton.on('click',
                    function()
                    {
                        fileAccess.save( Editor.aceEditor.getSession().getValue() );
                    }
                );
            }
        );
    }

    TextEditViewApp.prototype.focus = function()
    {
        var editor = ace.edit("editor");
        editor.focus();
    }

    TextEditViewApp.prototype.resize = function(width, height)
    {
        console.log("resize " + width + " , " + height);
    }

    return TextEditViewApp;
})()

