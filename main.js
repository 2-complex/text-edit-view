
function()
{
    TextEditViewApp = function()
    {
        this.textView = null;
    }

    TextEditViewApp.makeTextView = function(idName, className)
    {
        var elem = document.createElement('div');
        elem.id = idName;
        elem.class = className;
        return elem;
    }

    TextEditViewApp.prototype.launch = function(containerDiv)
    {
        containerDiv.style.backgroundColor = "#eee";
        this.textView = makeTextView("my-text-view-div", "fill")
        containerDiv.appendChild( this.textView );
    }

    TextEditViewApp.prototype.open = function(fileAccess)
    {
        var thisApp = this;
        fileAccess.download(
            function(text)
            {
                // assign text to view here
            }
        );
    }

    return TextEditViewApp;
}

