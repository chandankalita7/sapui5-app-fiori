sap.ui.core.mvc.Controller.extend("sap.usrmgm.view.Detail", {
  onInit : function() {
    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
  },

  onRouteMatched: function(oEvent) {
    var oParameters = oEvent.getParameters();

    // when detail navigation occurs, update the binding context
    if (oParameters.name !== "detail") {
      return;
    }

    var sEntityPath = "/" + oParameters.arguments.entity;
    this.bindView(sEntityPath);
  },

  bindView: function(sEntityPath) {
    var oView = this.getView();
    oView.bindElement(sEntityPath);

    // check if the data already on the client
    if(!oView.getModel().getData(sEntityPath)) {
      // check that the entity specified actually was found
      oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
        var oData = oView.getModel().getData(sEntityPath);
        if (!oData) {
          this.showEmptyView();
        } else {
          // 
        }
      }, this));
    }
  },

  showEmptyView: function() {
    sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({ 
      currentView : this.getView(),
      targetViewName : "sap.usrmgm.view.NotFound",
      targetViewType : "XML"
    });    
  },

  onUpdate: function() {
    var oView = this.getView();
    var oProperty = this.getView().getBindingContext().getProperty();
    var oModel = this.getView().getModel();
    var mUserData = {};

    mUserData.Uuid = oProperty.Uuid;
    mUserData.Email = oView.byId("idEmail").getValue();
    mUserData.Firtname = oView.byId("idFirtname").getValue();
    mUserData.Lastname = oView.byId("idLastname").getValue();

    oModel.update("/YWJ_USERSSet('" + oProperty.Uuid + "')", mUserData, null, function(){
      oModel.refresh();
      alert("Update successful");
    }, function() {
      alert("Update failed");
    });
  },

  onDelete: function() {
    var oView = this.getView();
    var oProperty = oView.getBindingContext().getProperty();
    var oModel = this.getView().getModel();

    oModel.remove("/YWJ_USERSSet('" + oProperty["Uuid"] + "')", null, function(){
      alert("Delete successful");
      oModel.refresh();
    }, function() {
      alert("Delete failed");
    });
  }

});