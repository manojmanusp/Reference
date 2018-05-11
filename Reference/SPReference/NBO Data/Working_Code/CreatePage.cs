using System;
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
using System.ServiceProcess;
using System.Collections;


namespace PageWithPageLayout
{
    public partial class CreatePage : System.Windows.Forms.Form
    {
        public CreatePage()
        {
            InitializeComponent();
        }

        private void CreatePage_Load(object sender, EventArgs e)
        {

        }

        private void BtnSubmit_Click(object sender, EventArgs e)
        {
            progressBar.Show();
            progressBar.Minimum = 1;
            // Set Maximum to the total number of Users created.
            progressBar.Maximum = 100;
            // Set the initial value of the ProgressBar.
            progressBar.Value = 1;            
            string pageName = TxtPageName.Text + ".aspx";
            string pageUrl = TxtUrl.Text;
            string pageTitle = TxtPageName.Text;
            string pageLibrary = "Pages";
            string pageLayout = "NBOMobileAppPageLayout";
            string folderName = TxtFolderName.Text;           
            
            IList<Coll> listColl = new List<Coll>(){
                new Coll(){ Title = "NationalBankofOman_Zone1CarouselWebpart", FileName = "NationalBankofOman_Zone1CarouselWebpart.webpart",ZoneId="webpartIDZone1"},
                new Coll(){ Title = "NationalBankofOman_Zone2VideoWebpart", FileName = "NationalBankofOman_Zone2VideoWebpart.webpart",ZoneId="webpartIDZone2"},
                new Coll(){ Title = "NationalBankofOman_Zone3CarouselWebpart", FileName = "NationalBankofOman_Zone3CarouselWebpart.webpart",ZoneId="webpartIDZone3"},
                new Coll(){ Title = "NationalBankofOman_Zone4CarouselWebpart", FileName = "NationalBankofOman_Zone4CarouselWebpart.webpart",ZoneId="webpartIDZone4"},
                new Coll(){ Title = "NationalBankofOman_Zone5GuideCarouselWebpart", FileName = "NationalBankofOman_Zone5GuideCarouselWebpart.webpart",ZoneId="webpartIDZone5"},
                new Coll(){ Title = "NationalBankofOman_Zone6PageFooterWebpart", FileName = "NationalBankofOman_Zone6PageFooterWebpart.webpart",ZoneId="webpartIDZone6"},
                };
            using (var clientContext = new ClientContext(pageUrl))
            {
                string userName = "";
                string pass = "";               
                
                if (pageUrl.Contains("sharepoint.com")) {
                    userName = "murali@chennaitillidsoft.onmicrosoft.com";
                    pass = "ThisIsRight1!";
                    SecureString userPassword = PasswordBuilder(pass);
                    clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);
                }
                else
                {
                    userName = "administrator";
                    pass = "Adm!n@321";
                    string domain = "win-o9gikgho82j";
                    SecureString userPassword = PasswordBuilder(pass);
                    clientContext.Credentials = new NetworkCredential(userName, userPassword, domain);
                }
                Web webSite = clientContext.Web;
                clientContext.Load(webSite);
                PublishingWeb web = PublishingWeb.GetPublishingWeb(clientContext, webSite);
                clientContext.Load(web);
                
                if (web != null)
                {
                    // Get Pages Library    
                    //List pages = clientContext.Site.RootWeb.Lists.GetByTitle(pageLibrary);
                    List pages = clientContext.Web.Lists.GetByTitle(pageLibrary);
                    var folder = pages.RootFolder;
                    clientContext.Load(folder);
                    ListItemCollection existingPages = pages.GetItems(CamlQuery.CreateAllItemsQuery());
                    clientContext.Load(existingPages, items => items.Include(item => item.DisplayName).Where(obj => obj.DisplayName == pageTitle));
                    clientContext.ExecuteQuery();
                    progressBar.Value = 20;
                    //folder = folder.Folders.Add(folderName);
                    folder=folder.Folders.Add(folderName);                    
                    clientContext.ExecuteQuery();
                    // Check if page already exists    
                    if (existingPages != null && existingPages.Count > 0)
                    {
                        // Page already exists    
                        MessageBox.Show("Page already exists.\n");
                        
                    }
                    else
                    {
                        // Get Publishing Page Layouts    

                        List publishingLayouts = clientContext.Site.RootWeb.Lists.GetByTitle("Master Page Gallery");
                        ListItemCollection allItems = publishingLayouts.GetItems(CamlQuery.CreateAllItemsQuery());

                        clientContext.Load(allItems, items => items.Include(item => item.DisplayName).Where(obj => obj.DisplayName == pageLayout));
                        clientContext.ExecuteQuery();
                        progressBar.Value = 40;
                        ListItem layout = allItems.Where(x => x.DisplayName == pageLayout).FirstOrDefault();
                        clientContext.Load(layout);

                        // Create a publishing page    
                        PublishingPageInformation publishingPageInfo = new PublishingPageInformation();
                        publishingPageInfo.Name = pageName;
                        publishingPageInfo.PageLayoutListItem = layout;
                        publishingPageInfo.Folder = folder;

                        PublishingPage publishingPage = web.AddPublishingPage(publishingPageInfo);


                        publishingPage.ListItem.File.CheckIn(string.Empty, CheckinType.MajorCheckIn);
                        publishingPage.ListItem.File.Publish(string.Empty);
                        
                        
                        clientContext.Load(publishingPage);
                        //string pagepath = publishingPage.ListItem.File.ServerRelativePath.ToString();
                        clientContext.ExecuteQuery();
                       
                        progressBar.Value = 60;


                        MessageBox.Show("Page Created.\n");
                        //webSite.ServerRelativeUrl +
                        // Adding webpart to page
                        string pagePath = webSite.ServerRelativeUrl+"/" + pageLibrary + "/"+folderName+"/"+ pageName;

                        Microsoft.SharePoint.Client.File page = webSite.GetFileByServerRelativeUrl(pagePath);

                        clientContext.Load(page);
                        clientContext.ExecuteQuery();
                        progressBar.Value = 80;
                        if (page.CheckOutType != CheckOutType.Online)
                        {
                            //Check out  
                            page.CheckOut();
                        }
                        
                        //Call function with parameters to add webparts to zone in page
                        foreach (Coll currentItem in listColl) { 
                          AddWebPartsToPage(clientContext, page, currentItem.Title, currentItem.FileName,currentItem.ZoneId);
                        }
                        progressBar.Value = 100;
                    }
                }

            }
        }
        public SecureString PasswordBuilder(string pass)
        {
            SecureString password = new SecureString();
            for (var i = 0; i < pass.Length; i++)
            {
                password.AppendChar(pass[i]);
            }
            return password;
        }
        public class Coll
        {
            public string Title { get; set; }
            public string FileName { get; set; }
            public string ZoneId { get; set; }

        }
        private void AddWebPartsToPage(ClientContext ctx, Microsoft.SharePoint.Client.File currentPage, string webPartTitle, string webPartFileName, string zoneID)
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
            if (filteredWebParts.Count()<=0) {
                List list = ctx.Site.RootWeb.Lists.GetByTitle("Web Part Gallery");
                ctx.Load(list);
                ctx.ExecuteQuery();

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
                            // Read the stream to a string, and write the string to the console.
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

