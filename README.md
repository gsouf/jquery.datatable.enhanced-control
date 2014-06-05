Simple jQuery Datatable Control
===============================

This package offers you a simple way to use jquery.datatable. 
It gives a fast access to selectable rows, allows to get the selection and adding items.

**BETA VERSION** : feel free to repport any bug

Requirement
-----------

You just have to include jQuery and jQuery.dataTable. 
You may use any theme you want for datatable.

** Example of minimal requirement**

```html

    <link rel="stylesheet"  href="jquery.dataTables.css"/>
    <link rel="stylesheet"  href="dt.enhanced-controller.css"/>

    <script src="jquery-1.11.0.min.js"></script>
    <script src="jquery.dataTables.js"></script>
    <script src="./dt.enhanced-controller.js"></script>
    
```

Basic Usage
-----------

The whole thing is controlable directly from javascript.


```javascript

    dt = new dtEnhanced.table({

        fields:["id","first-name","last-name"],
        data  :[
            {"id":1,"first-name":"john","last-name":"doe"},
            {"id":2,"first-name":"unknown","last-name":"smith"},
            {"id":2,"first-name":"bob","last-name":""}
        ] 

    });

    dt.show("#mydatatable"); // append the table in the element with id "mydatatable"

```

**Render** 

![Image](../master/screens/readme-fig1.png?raw=true)


Manipulation of the selected rows
---------------------------------

This library allows you to check some rows by clicking them. Then you can get the selection.

Just add "x" in the field configuration and a button : 

```javascript

dt = new dtEnhanced.table({

        fields:["x","id","first-name","last-name"],
        data  :[
            {"id":1,"first-name":"john","last-name":"doe"},
            {"id":2,"first-name":"unknown","last-name":"smith"},
            {"id":2,"first-name":"bob","last-name":""}
        ] 

    });

    dt.show("#mydatatable");

    $("#myButton").click(function(){
        console.log(dt.getSelection());    
    });

```

**Render** 

![Image](../master/screens/readme-fig2.png?raw=true)


**Ouput when click** 

![Image](../master/screens/readme-fig3.png?raw=true)



Customize dataTable Options
---------------------------

When calling ``dt.show("#element")`` you can use as second parameter the config to pass to the datatable :

``dt.show("#element",{/*datatable config*/});``

is equivalent to 

``$("#element").html($(theTable)); $(theTable).datatable({/*datatable config*/});``



Adding item dynamically
-----------------------

Once your datatable lives you still can add items with the method 

``dt.addItem(/* one item or an array of items */);``

For instance you may add items selected in one table to another

```javascript

$("#myButton").click(function(){
    
    dt1.addItem( dt2.getSelection() );
    dt2.clearSelection(); // => will be implemented very soon 

});

```

TODO : include online example


Configuration
-------------

```javascript

new dtEnhanced.table({
    
    // The data that will fill the table
    // it's an array of objects. Each object will be one row of the table
    "data"          : [],

    // This defines how yo display the data and what data to display
    // it's an array of objects. Each object will be one column of the table
    // see below for more information about fields
    "fields"        : [],

    // handler triggered when the selection changes
    "selectionChange" : function(){
        console.log(this.getSelection());
    },

    // Defines if the rows are selectable
    // Possible values :
    //  - "single"  : only one row can be selected
    //  - "multi"   : unbound number of rows can be selected
    //  - false     : no selection
    //  - int value : define the max number of rows that can be selected
    "selectable"    : "single"
});

```


Fields Configuration
--------------------

A field is a column of the table. In the configuration a field can be either of :

* an object configuration : see options below
* a string : see below for example
* an instance of dtEnhanced.field
* a special string : "x" for selection checkbox


```javascript

    "fields"  : [

        // Object configuration case
        {
            // name of the key you want to show from the data
            // in this case we want to show data["id"]
            "name"      : "id",

            // width in pixels of the column. Leave it null for auto sizing
            "width"     : 5,

            // a render function to customize what we want to show
            // if null we just will take the value of data["id"]
            // in this example we show the id as a clickable link
            "render"    : function(){ return "<a href='http://.../item?id=" + value + "'>" + value + "</a> "; },

            // The text to show in the header. If null it will be replaced by the value of "name"
            "header"    : null,

            // One or more css class to apply to the column ; split by spaces
            // usable in css or js with : "table.dataTable>tr>td.myclass"
            "class"     : "myclass"
        },



        // string case
        // this is a shortcut for {"name":"first-name"}
        "first-name", 



        // instance of dtEnhanced.field case
        new dtEnhanced.field({"name" : "last-name"}),

        // special string "x" case
        // this is a shortcut for new dtEnhanced.checkboxField();
        "x"

    ]

```



ROADMAP
-------

* [x] Field.class usable with a callback
* [ ] intuitive serverside processing
* [x] shift click for multi select
* [ ] removeItem()
* [ ] clearSelection()
* [ ] column order
* [ ] serialisation
* [ ] un/select all row from header
* [ ] some examples online : github page
* [ ] bower inclusion
* [ ] minification
* [x] searcheable / visible / orderable columns
* [ ] groupable headers
* [ ] row callback for customizing tr class (eg : one color per row type)
* [ ] row grouping
* [x] row detail (show/hide)
* [ ] tooltip
* [ ] colmun alignment
* [ ] update the readme
* [x] make datatable api easyly reachable
