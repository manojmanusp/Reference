using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.WebParts;
using System.Xml;
using System.Security;


namespace AddWPToPage
{
    class Program
    {
        static void Main(string[] args)
        {
            var listName = "NewRequestList";
            var viewUrl = "";
            string userName = "murali@chennaitillidsoft.onmicrosoft.com";
            Console.WriteLine("Enter your password.");
            string pass = "ThisIsRight1!";
            SecureString  password= new SecureString();
            for (var i = 0; i < pass.Length; i++)
            {
                password.AppendChar(pass[i]);
            }
           

            var newScriptEditor = @"<webParts>
  <webPart xmlns='http://schemas.microsoft.com/WebPart/v3'>
    <metaData>
      <type name='Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c' />
      <importErrorMessage>Cannot import this Web Part.</importErrorMessage>
    </metaData>
    <data>
      <properties>
        <property name='ExportMode' type='exportmode'>All</property>
        <property name='HelpUrl' type='string' />
        <property name='Hidden' type='bool'>False</property>
        <property name='Description' type='string'>Allows authors to insert HTML snippets or scripts.</property>
        <property name='Content' type='string'>&lt;link rel='stylesheet' href='https://kendo.cdn.telerik.com/2018.1.221/styles/kendo.common.min.css' /&gt;
&lt;link rel='stylesheet' href='https://kendo.cdn.telerik.com/2018.1.221/styles/kendo.uniform.min.css' /&gt;

    &lt;link rel='stylesheet' href='https://kendo.cdn.telerik.com/2018.1.221/styles/kendo.common.mobile.min.css' /&gt;
  &lt;link rel='stylesheet' href='https://kendo.cdn.telerik.com/2018.1.221/styles/kendo.uniform.mobile.min.css' /&gt;

    &lt;script src='https://kendo.cdn.telerik.com/2018.1.221/js/jquery.min.js'&gt;&lt;/script&gt;
    &lt;script src='https://kendo.cdn.telerik.com/2018.1.221/js/kendo.all.min.js'&gt;&lt;/script&gt;
    &lt;script type='text/javascript' src='/sites/oct9_QA1/SiteAssets/js/NewRequestForm_update.js' /&gt;&lt;/script&gt;</property>
        <property name='CatalogIconImageUrl' type='string' />
        <property name='Title' type='string'>Script Editor</property>
        <property name='AllowHide' type='bool'>True</property>
        <property name='AllowMinimize' type='bool'>True</property>
        <property name='AllowZoneChange' type='bool'>True</property>
        <property name='TitleUrl' type='string' />
        <property name='ChromeType' type='chrometype'>None</property>
        <property name='AllowConnect' type='bool'>True</property>
        <property name='Width' type='unit' />
        <property name='Height' type='unit' />
        <property name='HelpMode' type='helpmode'>Navigate</property>
        <property name='AllowEdit' type='bool'>True</property>
        <property name='TitleIconImageUrl' type='string' />
        <property name='Direction' type='direction'>NotSet</property>
        <property name='AllowClose' type='bool'>True</property>
        <property name='ChromeState' type='chromestate'>Normal</property>
      </properties>
    </data>
  </webPart>
</webParts>";
           

            // ClienContext - Get the context for the SharePoint Online Site  
            // SharePoint site URL -  
            using (var clientContext = new ClientContext("https://chennaitillidsoft.sharepoint.com/sites/oct9_QA1/IAccess"))
            {
                // SharePoint Online Credentials  
                clientContext.Credentials = new SharePointOnlineCredentials(userName, password);
                // Get the SharePoint web  
                Web web = clientContext.Web;
                //Web web = clientContext.Site.OpenWeb("https://chennaitillidsoft.sharepoint.com/sites/oct9_QA1/IAccess");
                List list = web.Lists.GetByTitle(listName);

                ViewCollection viewColl = list.Views;
                clientContext.Load(web);
                clientContext.Load(viewColl);
                clientContext.ExecuteQuery();
                foreach (View view in viewColl)

                {
                    viewUrl = view.ServerRelativeUrl;
                   
                    Microsoft.SharePoint.Client.File page = web.GetFileByServerRelativeUrl(viewUrl);
                    clientContext.Load(page);
                    clientContext.ExecuteQuery();

                    if (page.CheckOutType != CheckOutType.Online)
                    {
                        //Check out  
                        page.CheckOut();
                    }
                    // Gets the webparts available on the page  
                    var wpm = page.GetLimitedWebPartManager(PersonalizationScope.Shared);
                    clientContext.Load(wpm.WebParts,
                        wps => wps.Include(wp => wp.WebPart.Title));
                    clientContext.ExecuteQuery();

                    var availableWebparts = wpm.WebParts;
                    // Check if the current webpart already exists.  
                    var filteredWebParts = from isWPAvail in availableWebparts
                                           where isWPAvail.WebPart.Title == "Script Editor"
                                           select isWPAvail;
                    if (filteredWebParts.Count() <= 0)
                    {
                        // Import the webpart xml  
                        var importedWebPart = wpm.ImportWebPart(newScriptEditor);
                        var webPart = wpm.AddWebPart(importedWebPart.WebPart, "Header", 8);
                        clientContext.ExecuteQuery();
                    }
                    Console.WriteLine("WebPart Added Successfully");
                    

                }
            }
        }
        private static SecureString GetPassword()
        {
            ConsoleKeyInfo info;
            //Get the user's password as a SecureString  
            SecureString securePassword = new SecureString();
            do
            {
                info = Console.ReadKey(true);
                if (info.Key != ConsoleKey.Enter)
                {
                    securePassword.AppendChar(info.KeyChar);
                }
            }
            while (info.Key != ConsoleKey.Enter);

            return securePassword;
        }
    }
}
