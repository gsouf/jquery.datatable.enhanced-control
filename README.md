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

    dt = new dtEnhanced.Datatable({

        columns:["id","first-name","last-name"],
        data  :[
            {"id":1,"first-name":"john","last-name":"doe"},
            {"id":2,"first-name":"unknown","last-name":"smith"},
            {"id":2,"first-name":"bob","last-name":""}
        ] 

    });

    dt.show("#mydatatable"); // append the table in the div with id "mydatatable"

```

**Render** 

![Image](../master/screens/readme-fig1.png?raw=true)



FULL DOCUMENTATION & EXAMPLES
-----------------------------

The doc is not achieved, it's still being written, but you can see it at : http://sneakybobito.github.io/jquery.datatable.enhanced-control



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
* [x] tooltip
* [ ] colmun alignment
* [ ] update the readme
* [x] make datatable api easyly reachable
* [ ] check requirement (jquery/datatable and plugins)
* [x] selection memory
* [x] selection count in sdom
* [ ] controls in sdom (view selection + clear all selection)
* [ ] toolbar
* [ ] use as a select button
