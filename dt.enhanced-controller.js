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
    
            {name:"id",width:20,render:function(value,set,items,data){return value;},header:"#",class:"custom-class" },
            "name",

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

        var items = this.getItems();

        for(var i in items){
            this.__addRow(items[i]);
        }

    };
    
    dtEnhanced.table.defaultConfig = {
        "data"           : [],
        "itemsRoot"      : null,
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

        initTable : function(){

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

            for(var i in this.fields){

                $col = this.fields[i].makeHeaderCol(this)
                $row.append($col);

            }

            

            return $table;

        },

        addItem : function(set){

            if(set instanceof Array){
                for(var i in set){
                    this.addItem(set[i]);
                }
            }else{

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
            }

        },


        /* INTERNAL USAGE ONLY use addItem instead */
        __addRow : function(set){
            var $tr   = $("<tr/>");

            for(var i in this.fields){
                $tr.append(this.fields[i].makeBodyCol(this,set));
            }
            
            this.$table.find("tbody").append($tr);

            this.__bindRow(set,$tr);

        },

        __bindRow : function(set,$tr){
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

        
        getItems : function(){
            return this.itemsRoot ? this.data[this.itemsRoot] : this.data;
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
            $(elm).html(this.$table);
            this.$table.dataTable(dtConfig);
        }

    };




/*============== FIELD ==============*/

    /**

    Possible values for config :

        - field config : name,width,render,header,class  // only name is mandatory
        - string => name config alone

    */
    dtEnhanced.field = function(config){

        var defaultConfig = {
            "name"      : "",
            "width"     : null,
            "render"    : null,
            "header"    : null,
            "class"     : null
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
            var $td = $("<td/>");
            // fill it
            if(this.render)
                $td.html(this.render(set[this.name],set,table.getItems));
            else
                $td.html(set[this.name]);

            return $td;

        }

    };






/*============== CHECKBOX FIELD ==============*/



    dtEnhanced.checkboxField = function(config){

        dtEnhanced.field.apply(this,[config]);
        this.width = 15;

    };

    dtEnhanced.checkboxField.prototype = Object.create(dtEnhanced.field.prototype);

    dtEnhanced.checkboxField.prototype.makeBodyCol = function(table,set){
        var $td = $("<td/>");
        $td.append("<div class='dtec-select-field' />");
        return $td;
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
        var $td = $("<td/>");
        var self = this;
        var $content = $("<div class='dtec-details-control'/>");
        
        if(this.content){
            if(( typeof(this.content) === "function" )){
                $content.html(this.content(set , table.getItems() , table.data ));
            }else{
                $content.html(this.content);
            }
        }
        
        $content.appendTo($td);
        
        $td.click(function(){
            
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
        return $td;
    };




    return dtEnhanced;

}(jQuery);
