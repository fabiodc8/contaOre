sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/core/routing/Router"
], function (MessageToast, Controller, Log, Router) {
	"use strict";
	return Controller.extend("ui.ui.controller.Progetti", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ui.ui.view.Progetti
		 */
		onInit: function () {},
		onOrientationChange: function (oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, {
				duration: 5000
			});
		},
		onPressNavToDetail: function () {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},
		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},
		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},
		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();
			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, {
				duration: 5000
			});
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		onAddButtonPress: function () {
			this.getSplitAppObj().to(this.createId("createProject"));
		},
		onCreateDialog: function (oEvent) {
				if (this._oDialog & this._oDialog !== undefined) {
					this._oDialog.destroy();
					this._oDialog = undefined;
				}
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("contaOre.ui.view.fragment.insTask", this.getView().getController());
					this.getView().addDependent(this._oDialog);
				}
				// return this._oDialog;
				this._oDialog.open();
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf ui.ui.view.Progetti
			 */
			//	onBeforeRendering: function() {
			//
			//	},
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf ui.ui.view.Progetti
			 */
			//	onAfterRendering: function() {
			//
			//	},
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf ui.ui.view.Progetti
			 */
			//	onExit: function() {
			//
			//	}
			,
		/**
		 *@memberOf ui.ui.controller.Progetti
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
});