sap.ui.define([],function(){
    "use Strict"

    return {
        formatName:function(Name){
            return "Mr " + Name
        },
        colorSkill:function(Skill){
            if(Skill === "FIORI"){
                return "Error"
            }
            else if(Skill === "CAPM"){
                return "Success"
            }
        },
        colorStatus:function(Status){
            if(Status === "PERMANANT"){
                return "Error"
            }
            else if(Status === "CONTRACTUAL"){
                return "Success"
            }
        },
        formatDate:function(Doj){
            var oDateFormat= sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern:"dd-MM-yyy"
            },sap.ui.getCore().getConfiguration().getLocale())
            return oDateFormat.format(Doj)
        }
    }
})