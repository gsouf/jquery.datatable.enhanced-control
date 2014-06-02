;
/**
    config example : 

    {
        
        data:[
            {id : "1" , name : "name1"},
            {id : "2" , name : "name2"}
        ],

        itemsRoot:"items",

        fields: [
    
            {   
                name:"id",
                width:20,
                render:function(value,set,items,data){return value;},
                header:"#",
                class:"custom-class" 
            },
            

        ],

        idField: "id",

        selectable: "single", // possible values "single","multiple",false

        selectionChange:function(){ console.log(this.getSelection()); };

        childContent : function(set,items,data){ return "Full Name : " + set.firstname + " " +  set.lastname; };

    }

 */



var dtEnhanced = function($){

    var dtEnhanced = {};



/*============== TABLE ==============*/

    
    
    dtEnhanced.table = function(config){

        jQuery.extend(
            this,
            dtEnhanced.table.defaultConfig,
            config
        );

        this.fields = this.initFields(this.fields);
        this.$table = this.initTable();

        

    };
    
    dtEnhanced.table.defaultConfig = {
        "fields"         : null,
        "idField"        : null,
        "selectable"     : "single",
        "selectionChange": null,
        "childContent"   : null
    };

        

    dtEnhanced.table.prototype = {

        initFields: function(fields){

            var finalFields = [];

            for(var i in fields){
                if(fields[i] instanceof dtEnhanced.field ){
                    finalFields[i] = fields[i];
                }else{
                    if(typeof fields[i] === "object" &&  (!fields[i].type || !fields[i].type === "field" ) ){
                        finalFields[i] = new dtEnhanced.field(fields[i]);
                    }else{
                        
                        
                        var type = null
                        if(typeof fields[i] === "object")
                            type = fields[i].type;
                        else
                            type = fields[i];
                        
                        switch(type){

                            case "x":
                                finalFields[i] = new dtEnhanced.checkboxField(fields[i]);
                                break;
                                
                            case "+":
                                finalFields[i] = new dtEnhanced.detailsControlField(fields[i]);
                                break;

                            default:
                                finalFields[i] = new dtEnhanced.field(fields[i]);
                                break;

                        }
                    }
                }
            }

            return finalFields;

        },
                
        
        addItem : function(set){

            if(set instanceof Array){
                for(var i in set){
                    this._e_addItem(set[i]);
                }
            }else{
                this._e_addItem(item);

            }

        },
                
        _e_addItem : function(item){
            console.log("addItem not implemented");
        },
                

        initTable : function(){

            this.dtColumns = [];

            var self = this;
            var selfTable = this;
            var fields = this.fields;

            // PREPARE THE STRUCTURE
            var $table = $('<table class="table table-striped table-bordered"/>');
            var $thead = $("<thead/>");
            var $tbody  = $("<tbody/>");
            $table.append($thead);
            $table.append($tbody);

            $table.data("dtec-object",this);

            // CREATE THE HEADER
            $row = $("<tr/>");
            $thead.append($row);

            for(var i in fields){

                var field = fields[i];

                $col = field.makeHeaderCol(this);
                $row.append($col);

                var renderCallback = (function ( i , fields ){
                    return function ( data , type , set , meta ) {
                        return fields[i].makeBodyCol(self,set).html();
                    };
                }(i,fields));

                var createdCallback = (function ( i , fields ){
                    return function ( cell, cellData, rowData, rowIndex, colIndex ) {
                        fields[i].bindCol( self , cell );
                    };
                }(i,fields));

                var definition = {
                    "searchable" : this.fields[i].searchable,
                    "orderable"  : this.fields[i].orderable,
                    "data"       : this.fields[i].name,
                    "render"     : renderCallback,
                    "createdCell": createdCallback
                };
                
                
                
                this.fields[i]._postInitDtColumnDef(this,definition);
                
                this.dtColumns.push(definition);

            }
 
            
            return $table;
        },


        __bindRow : function(set,tr){
            var $tr = $(tr);
            var self  = this;
            // CLICK HANDLER
            $tr.click(function(){
                self.rowClicked(this);
            });
            // STORE THE SET TO FIND IT LATER
            $tr.data("dtec-set",set);
        },

        // reserved for internal use
        // it applies the new stats of a row (selected/unselected) that is clicked
        // returns true if the stat changed
        __makeRowSelection : function(row){
            if(typeof this.selectable === "number"){
                if($(row).hasClass("dtec-row-selected")){
                    $(row).removeClass("dtec-row-selected");
                    return true;
                }else{
                    if(this.$table.find(".dtec-row-selected").length >= this.selectable){
                        // already reached the max selection
                        return false;
                    }else{
                        $(row).addClass("dtec-row-selected");
                        return true;
                    }
                }
            }else if(this.selectable === false){
                return false;
            }else if(this.selectable === "single"){
                if($(row).hasClass("dtec-row-selected")){
                    $(row).removeClass("dtec-row-selected");
                    return true;
                }else{
                    this.$table.find(".dtec-row-selected").removeClass("dtec-row-selected");
                    $(row).addClass("dtec-row-selected");
                    return true;
                }
            }else if(this.selectable === "multi"){
                $(row).toggleClass("dtec-row-selected");
                return true;
            }
        },

        rowClicked : function(row){
            
            var s = this.__makeRowSelection(row);
            
            if(s && this.selectionChange){
                this.selectionChange.apply(this,[]);
            }
        },

        getSelectedRows : function(){

            var rows = this.$table.dataTable().fnGetNodes();
            var selRows = [];

            for(var i in rows){
                if( $(rows[i]).hasClass("dtec-row-selected") )
                    selRows.push(rows[i]);
            } 
            return selRows;
        },

        getSelection :function(){
            
            var items = [];

            var rows = this.getSelectedRows();

            for(var i in rows){
                items.push($(rows[i]).data("dtec-set"));
            }

            return items;
        },

        show : function(elm,dtConfig){
            var self = this;

            $(elm).html(this.$table);
            
            dtConfig = dtConfig || {};

            dtConfig.columns    = this.dtColumns;
            dtConfig.createdRow = function(row,data,index){
                self.__bindRow(data,row);
            }

            this.dt = this.$table.DataTable(dtConfig);
        }
    };



/*============== DATATABLE ==============*/

    dtEnhanced.Datatable = function(config){
        var newConf = {};
        
        jQuery.extend(
            newConf,
            dtEnhanced.Datatable.defaultConfig,
            config
        );
            
        dtEnhanced.table.apply(this,[newConf]);
        
        

    };
    
    dtEnhanced.Datatable.prototype = Object.create(dtEnhanced.table.prototype);
    
    dtEnhanced.Datatable.defaultConfig = {
        "data"           : [],
        "itemsRoot"      : null
    };

    dtEnhanced.Datatable.prototype._e_addItem = function(item){
        
        if(this.itemsRoot)
            this.data[this.itemsRoot].push(set);
        else
            this.data.push(set);

        var renderedSet = [];

        for(var i in this.fields){
            renderedSet.push(this.fields[i].makeBodyCol(this,set).html());
        }

        var index = this.$table.dataTable().fnAddData(renderedSet);

        this.__bindRow(set, $(this.$table.dataTable().fnGetNodes(index)) );
        
    };
    

    dtEnhanced.Datatable.prototype.getItems = function(){
        return this.itemsRoot ? this.data[this.itemsRoot] : this.data;
    };
            
    dtEnhanced.Datatable.prototype.show = function(elm,config){

        dtEnhanced.table.prototype.show.apply(this,[elm,config]);
        
        var items = this.getItems();

        for(var i in items){
            this.dt.row.add(items[i]);
        }
        
        this.dt.draw();
        
    };


/*============== FIELD ==============*/

    /**

    Possible values for config :

        - field config : name,width,render,header,class,searchable,orderable  // only name is mandatory
        - string => name config alone

    */
    dtEnhanced.field = function(config){

        var defaultConfig = {
            "name"      : "",
            "width"     : null,
            "render"    : null,
            "header"    : null,
            "class"     : null,
            "searchable": true,
            "orderable" : true
        };

        // if not an object then it is the name only
        if(typeof config !== 'object'){

            jQuery.extend(this,defaultConfig,{
                "name":config
            });
        
        }else{

            jQuery.extend(this,defaultConfig,config);

        }

    };

    dtEnhanced.field.prototype = {

        /**
         * called to overide init of column definition. Usefull to do special stuff for special column type (checkable, details...)
         */
        _postInitDtColumnDef : function(table,definition){
            return definition;
        },

        makeHeaderCol : function(table){

            var $field = $("<th/>");

            // if user size, set it
            if(this.width>0)
                $field.css({"width":this.width + "px"});

            // set the title : header config, if not specified, then set the name instead
            $field.html(this.header ? this.header : this.name);

            return $field;

        },

        makeBodyCol : function(table,set){
    
            var $div = $("<div/>");
    
            // fill it
            if(this.render)
                $div.html(this.render(set[this.name],set,table.getItems));
            else
                $div.html(set[this.name]);

            return $div;

        },

        bindCol : function(table,td){
            
        }

    };






/*============== CHECKBOX FIELD ==============*/



    dtEnhanced.checkboxField = function(config){

        dtEnhanced.field.apply(this,[config]);
        this.width = 15;

    };

    dtEnhanced.checkboxField.prototype = Object.create(dtEnhanced.field.prototype);

    dtEnhanced.checkboxField.prototype.makeBodyCol = function(table,set){
        var $div = $("<div/>");
        $div.append("<div class='dtec-select-field' />");
        return $div;
    };
    
    
    
/*============== DETAILS CONTROL FIELD ==============*/
    
    /**
     * aditional config :
     * 
     * - content      : "view details"  // also possible as a callback : function(set,items,fullData)
     * - childContent : function(set,items,fullData)
     * 
     * childcontent mays overide the childContent defined on the table
     * 
     * @param {type} config
     * @returns {undefined}
     */
    dtEnhanced.detailsControlField = function(config){

        dtEnhanced.field.apply(this,[config]);
        this.width   = 15;
        this.content = config.content || "+";

    };

    dtEnhanced.detailsControlField.prototype = Object.create(dtEnhanced.field.prototype);

    dtEnhanced.detailsControlField.prototype.makeBodyCol = function(table,set){
        var $div = $("<div/>");
        var self = this;
        var $content = $("<div class='dtec-details-control'/>");
        
        if(this.content){
            if(( typeof(this.content) === "function" )){
                $content.html(this.content(set , table.getItems() , table.data ));
            }else{
                $content.html(this.content);
            }
        }
        
        $content.appendTo($div);
        
        return $div;
    };
    
    dtEnhanced.detailsControlField.prototype.bindCol = function(table,td){

        $(td).click(function(){

            var dtec = $(this).closest("table").data("dtec-object");
            var dt   = $(this).closest("table").DataTable();

            var $tr  = $(this).closest("tr");
            var row  = dt.row($tr);

            if( row.child.isShown() ){
                row.child.hide();
                $tr.removeClass('shown');
            }else{

                var callBack = null;

                if(self.childContent){
                    callBack = self.childContent;
                }else if(dtec.childContent){
                    callBack = dtec.childContent;
                }

                var content = callBack ? callBack(set , table.getItems() , table.data ) : "";
                row.child( content ).show();
                $tr.removeClass('shown');
            }

        });
        
    }
        
        
        



    return dtEnhanced;

}(jQuery);
