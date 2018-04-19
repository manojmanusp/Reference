<%@ Page language="C#"   Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue id="PageTitle" FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">
<WebPartPages:SPProxyWebPartManager runat="server" id="spproxywebpartmanager"></WebPartPages:SPProxyWebPartManager><section class="right_container">	
	    <div layout="row" class="layout-row">
	    	<div layout-margin-lg="" layout="column" flex="100" class="layout-margin-lg layout-column flex-100">
	    		<div class="inner_container">
		    		<div class="crumbs_container">
		    			<div layout="row" layout-align="start center" class="breadcrumbs layout-align-start-center layout-row">
							<a class="crumb_title">iAccess</a>
							<i class="material-icons">play_arrow</i>
							<a class="crumb_link" href="#">New Request</a>
						</div>	
		    		</div>
		    		<div class="form_container">
		    			
		    			
		    			

					<WebPartPages:WebPartZone id="g_38950741175D4CCAA638611278FE7845" runat="server" title="Zone 1">
					</WebPartPages:WebPartZone>
		    			
		    			
		    			

					</div>
					<div layout="row" class="layout-row">
        <div layout-margin-lg="" layout="column" flex="100" class="layout-margin-lg layout-column flex-100">
            
            
        <WebPartPages:WebPartZone id="g_EA2DEDE384D14307B8458D536D713BFF" runat="server" title="Zone 2">
		</WebPartPages:WebPartZone>
            
            
        </div>
    </div>
					
	    	</div>
	    </div>
	     
	    </div>
	</section></asp:Content>
