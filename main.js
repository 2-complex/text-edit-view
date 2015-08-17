
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

    var TextEditViewApp = function(editorDiv)
    {
        this.editorDiv = editorDiv;
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
        var editorDiv = TextEditViewApp.makeTextView("editor", "fill");
        containerDiv.appendChild( editorDiv );

        loader.loadScripts([
            "ace-builds/src/ace.js",
            "ace-builds/src/ext-modelist.js",
            ],
            function()
            {
                Editor.initEditor();
                receiveApp(new TextEditViewApp(editorDiv));
            });
    }

    TextEditViewApp.prototype.open = function(fileAccess)
    {
        var thisApp = this;

        var modelist = ace.require("ace/ext/modelist");
        var editor = ace.edit("editor");
        var mode = modelist.getModeForPath(fileAccess.getPath()).mode;
        editor.getSession().setMode(mode);

        fileAccess.download(
            function( text )
            {
                Editor.aceEditor.getSession().setValue(text);
            }
        );
    }

    return TextEditViewApp;
})()

