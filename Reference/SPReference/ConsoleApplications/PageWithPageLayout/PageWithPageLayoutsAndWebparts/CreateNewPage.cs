using System;
using System.Web;

using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Globalization;
using System.Windows.Forms;

using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Publishing;
using Microsoft.SharePoint.Client.WebParts;
using System.Security;
using System.Net;
using System.Collections;


namespace PageWithPageLayout
{
    public partial class CreateNewPage : System.Windows.Forms.Form
    {
        public CreateNewPage()
        {
            InitializeComponent();
        }

        private void CreateNewPage_Load(object sender, EventArgs e)
        {
            TableAddPage.Visible = true;
            TableAddWebpart.Visible = false;

        }

        private void BtnSubmit_Click(object sender, EventArgs e)
        {


            #region Global variables declaration   
            string pageName = TxtPageName.Text + ".aspx";
            string pageUrl = TxtUrl.Text;
            string pageTitle = TxtPageName.Text;
            string pageLibrary = "Pages";
            string pageLayout = "";
            string folderName = TxtFolderName.Text;
            IList<ItemCollection> listColl;


            #endregion
            LabelStatus.AutoSize = true;
            LabelStatus.Text = "Process started...";
            LabelStatus.Refresh();
            //progressBar.Style = ProgressBarStyle.Marquee;
            //progressBar.MarqueeAnimationSpeed = 10;
            progressBar.Show();
            //Progress Bar intialization
            progressBar.Minimum = 1;
            progressBar.Maximum = 100;
            progressBar.Value = 1;

            using (var clientContext = new ClientContext(pageUrl))
            {
                string userName = "";
                string pass = "";

                if (pageUrl.Contains("sharepoint.com"))
                {

                    //To connect SharePoint online with Authentication
                    userName = "murali@chennaitillidsoft.onmicrosoft.com";
                    pass = "ThisIsRight1!";
                    pageLayout = "TillidHomePageLayout";
                    SecureString userPassword = PasswordBuilder(pass);
                    clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);
                    listColl = new List<ItemCollection>(){
                                        new ItemCollection(){ Title = "Script Editor", FileName = "MSScriptEditor.webpart",ZoneId="g_6ABE154F568B46308B5E7CB189B9C47F"},
                                        new ItemCollection(){ Title = "Content Editor", FileName = "MSContentEditor.dwp",ZoneId="g_884854C4232C45F6AF25E1B4ED55F6F7"}
                                        };
                }
                else
                {
                    //To connect SharePoint On-premise with Authentication
                    userName = "administrator";
                    pass = "Adm!n@321";
                    string domain = "win-o9gikgho82j";
                    pageLayout = "NBOMobileAppPageLayout";
                    SecureString userPassword = PasswordBuilder(pass);
                    clientContext.Credentials = new NetworkCredential(userName, userPassword, domain);
                    listColl = new List<ItemCollection>(){
                                        new ItemCollection(){ Title = "NationalBankofOman_Zone1CarouselWebpart", FileName = "NationalBankofOman_Zone1CarouselWebpart.webpart",ZoneId="webpartIDZone1"},
                                        new ItemCollection(){ Title = "NationalBankofOman_Zone2VideoWebpart", FileName = "NationalBankofOman_Zone2VideoWebpart.webpart",ZoneId="webpartIDZone2"},
                                        new ItemCollection(){ Title = "NationalBankofOman_Zone3CarouselWebpart", FileName = "NationalBankofOman_Zone3CarouselWebpart.webpart",ZoneId="webpartIDZone3"},
                                        new ItemCollection(){ Title = "NationalBankofOman_Zone4CarouselWebpart", FileName = "NationalBankofOman_Zone4CarouselWebpart.webpart",ZoneId="webpartIDZone4"},
                                        new ItemCollection(){ Title = "NationalBankofOman_Zone5GuideCarouselWebpart", FileName = "NationalBankofOman_Zone5GuideCarouselWebpart.webpart",ZoneId="webpartIDZone5"},
                                        new ItemCollection(){ Title = "NationalBankofOman_Zone6PageFooterWebpart", FileName = "NationalBankofOman_Zone6PageFooterWebpart.webpart",ZoneId="webpartIDZone6"},
                                        };
                }
                Web webSite = clientContext.Web;
                clientContext.Load(webSite);
                PublishingWeb web = PublishingWeb.GetPublishingWeb(clientContext, webSite);
                clientContext.Load(web);
                if (TableAddPage.Visible)
                {
                    if (web != null)
                    {
                        // Get Pages Library

                        LabelStatus.Text = "Adding the folder '" + folderName + "'";
                        LabelStatus.Refresh();
                        List pages = clientContext.Web.Lists.GetByTitle(pageLibrary);
                        var folder = pages.RootFolder;
                        clientContext.Load(folder);
                        Microsoft.SharePoint.Client.ListItemCollection existingPages = pages.GetItems(CamlQuery.CreateAllItemsQuery());
                        clientContext.Load(existingPages, items => items.Include(item => item.DisplayName).Where(obj => obj.DisplayName == pageTitle));

                        progressBar.Value = 20;
                        folder = folder.Folders.Add(folderName);
                        clientContext.ExecuteQuery();

                        LabelStatus.Text = folderName + " folder is added successfully";
                        LabelStatus.Refresh();
                        // Check if page already exists    
                        if (existingPages != null && existingPages.Count > 0)
                        {
                            LabelStatus.Text = pageTitle + " page already exists.";
                            LabelStatus.Refresh();
                        }
                        else
                        {
                            // Get Publishing Page Layouts   

                            LabelStatus.Text = "Creating '" + pageTitle + "' page.....";
                            LabelStatus.Refresh();
                            List publishingLayouts = clientContext.Site.RootWeb.Lists.GetByTitle("Master Page Gallery");
                            Microsoft.SharePoint.Client.ListItemCollection allItems = publishingLayouts.GetItems(CamlQuery.CreateAllItemsQuery());
                            clientContext.Load(allItems);
                            //clientContext.Load(allItems, items => items.Include(item => item.DisplayName).Where(obj => obj.DisplayName == pageLayout));
                            clientContext.ExecuteQuery();
                            progressBar.Value = 30;
                            Microsoft.SharePoint.Client.ListItem layout = allItems.Where(currentLayout => currentLayout.DisplayName == pageLayout).FirstOrDefault();
                            clientContext.Load(layout);

                            // Create a publishing page    
                            PublishingPageInformation publishingPageInfo = new PublishingPageInformation();
                            publishingPageInfo.Name = pageName;
                            publishingPageInfo.PageLayoutListItem = layout;
                            publishingPageInfo.Folder = folder;

                            PublishingPage publishingPage = web.AddPublishingPage(publishingPageInfo);

                            publishingPage.ListItem["Title"] = pageTitle;
                            publishingPage.ListItem.File.CheckIn(string.Empty, CheckinType.MajorCheckIn);
                            publishingPage.ListItem.File.Publish(string.Empty);
                            clientContext.Load(publishingPage);

                            clientContext.ExecuteQuery();

                            LabelStatus.Text = pageTitle + " page is created successfully";
                            LabelStatus.Refresh();
                            TableAddPage.Visible = false;
                            TableAddWebpart.Visible = true;
                            TxtWebpartPage.Text = TxtPageName.Text;
                            RequestToAddWebParts(clientContext, webSite, pageLibrary, folderName, pageName, DrpdChooseWebpart);


                        }
                    }

                }


            }
        }

        //Adding webparts to page
        public static void RequestToAddWebParts(ClientContext clientContext,Web webSite,string pageLibrary, string folderName,string pageName,ComboBox paramChooseWebpart)
        {


            string pagePath = webSite.ServerRelativeUrl + "/" + pageLibrary + "/" + folderName + "/" + pageName;

            Microsoft.SharePoint.Client.File page = webSite.GetFileByServerRelativeUrl(pagePath);

            clientContext.Load(page);
            clientContext.ExecuteQuery();
            //progressBar.Value = 50;
            if (page.CheckOutType != CheckOutType.Online)
            {
                //Check out  
                page.CheckOut();
            }
            var wpm = page.GetLimitedWebPartManager(PersonalizationScope.Shared);
            //clientContext.Load(wpm.WebParts,
            //    wps => wps.Include(wp => wp.WebPart.Title));
            clientContext.Load(wpm);
            clientContext.ExecuteQuery();
            List list = clientContext.Site.RootWeb.Lists.GetByTitle("Web Part Gallery");
            clientContext.Load(list);
            Folder gallery = list.RootFolder;
            FileCollection files = gallery.Files;
            clientContext.Load(files);
            clientContext.ExecuteQuery();
            paramChooseWebpart.DisplayMember = "Text";
            paramChooseWebpart.ValueMember = "Value";

               

            
            //System.Web.UI.WebControls.ListItemCollection collection = new System.Web.UI.WebControls.ListItemCollection();
            foreach (Microsoft.SharePoint.Client.File file in files)
            {
                string webPartName = "";
                // string webPartName = file.Title.Split(',')[1].Replace(";", "").Trim();
                if (file.Title.Contains("Resources"))
                {
                     webPartName = file.Title.Split(',')[1].Replace(";", "").Trim();
                }
                else { 
                     webPartName = file.Title;
                }
                paramChooseWebpart.Items.Add(new { Text = webPartName, Value = webPartName });
                //ComboBoxItem item = new ComboBox
                //paramChooseWebpart.Text
                // collection.Add(new System.Web.UI.WebControls.ListItem(webPartName));
            }

           // paramChooseWebpart.DataSource = items;
            //FileInformation fileInformation = Microsoft.SharePoint.Client.File.OpenBinaryDirect(clientContext, (string)file.ServerRelativeUrl);
            //using (System.IO.StreamReader sr = new System.IO.StreamReader(fileInformation.Stream))
            //{


            //    string webPartXml = sr.ReadToEnd().ToString();
            //    // Read the stream to a string, and write to the string.

            //        var importedWebPart = wpm.ImportWebPart(webPartXml);
            //        var webPart = wpm.AddWebPart(importedWebPart.WebPart, zoneID, 0);
            //        clientContext.ExecuteQuery();

            //}


            //foreach (ItemCollection currentItem in listColl)
            //{

            //    LabelStatus.Text = "Adding '" + currentItem.Title + "' webpart to " + pageTitle + " page";
            //    LabelStatus.Refresh();
            //AddWebPartsToPage(clientContext, page, currentItem.Title, currentItem.FileName, currentItem.ZoneId);
            //    //Incrementing the value of progress bar
            //    progressBar.Increment(10);
            //}
            //progressBar.Value = 100;

            //LabelStatus.Text = "Process completed successfully";
            //TableAddPage.Visible = false;
            //TableAddWebpart.Visible = true;
        }



        // Password builder based on type of sharepoint environment
        public SecureString PasswordBuilder(string pass)
        {
            SecureString password = new SecureString();
            for (var i = 0; i < pass.Length; i++)
            {
                password.AppendChar(pass[i]);
            }
            return password;
        }

        //IList generic class
        public class ItemCollection
        {
            public string Title { get; set; }
            public string FileName { get; set; }
            public string ZoneId { get; set; }

        }

        //Call function with parameters to add webparts to zone in page
        public static void AddWebPartsToPage(ClientContext ctx, Microsoft.SharePoint.Client.File currentPage, string webPartTitle, string webPartFileName, string zoneID)
        {
            // Gets the webparts available on the page
            var wpm = currentPage.GetLimitedWebPartManager(PersonalizationScope.Shared);
            ctx.Load(wpm.WebParts,
                wps => wps.Include(wp => wp.WebPart.Title));
            ctx.ExecuteQuery();
            var availableWebparts = wpm.WebParts;
            // Check if the current webpart already exists.  
            var filteredWebParts = from isWPAvail in availableWebparts
                                   where isWPAvail.WebPart.Title == webPartTitle
                                   select isWPAvail;
            if (filteredWebParts.Count() <= 0)
            {
                List list = ctx.Site.RootWeb.Lists.GetByTitle("Web Part Gallery");
                ctx.Load(list);
                //ctx.ExecuteQuery();

                Folder gallery = list.RootFolder;
                FileCollection files = gallery.Files;
                ctx.Load(files);
                ctx.ExecuteQuery();

                foreach (Microsoft.SharePoint.Client.File file in files)
                {
                    if (file.Name.ToString().ToLowerInvariant() == webPartFileName.ToLowerInvariant())
                    {
                        FileInformation fileInformation = Microsoft.SharePoint.Client.File.OpenBinaryDirect(ctx, (string)file.ServerRelativeUrl);
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(fileInformation.Stream))
                        {


                            string webPartXml = sr.ReadToEnd().ToString();
                            // Read the stream to a string, and write to the string.
                            if (filteredWebParts.Count() <= 0)
                            {
                                var importedWebPart = wpm.ImportWebPart(webPartXml);
                                var webPart = wpm.AddWebPart(importedWebPart.WebPart, zoneID, 0);
                                ctx.ExecuteQuery();
                            }
                        }
                    }

                }
            }


        }
    }

}

