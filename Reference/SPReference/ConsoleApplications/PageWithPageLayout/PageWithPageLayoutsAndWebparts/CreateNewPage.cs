using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows.Forms;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Publishing;
using Microsoft.SharePoint.Client.WebParts;
using System.Security;
using System.Net;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.Web;
using System.Xml;
using System.Text.RegularExpressions;

namespace PageWithPageLayoutsAndWebparts
{

    public partial class CreateNewPage : System.Windows.Forms.Form
    {
        // public static List<string> Constants { get; private set; }


        public CreateNewPage()
        {
            InitializeComponent();

        }


        private void CreateNewPage_Load(object sender, EventArgs e)
        {
            string siteUrl = "http://tss.from-in.com:56789/en";
            ProgressBar progressBar = new ProgressBar() ;
            GetWebPartZones(siteUrl,progressBar, DropdownZones);
            //TableAddPage.Visible = true;
            //TableAddWebpart.Visible = false;
            //BtnSubmit.Visible = true;
            //BtnAddWebPart.Visible = false;
            //LblHeading.Visible = false;
            //LblStatus.Text = "";
            //LblProvisionStatus.Visible = false;

        }

        private void BtnSubmit_Click(object sender, EventArgs e)
        {
            string pageName = TxtPageName.Text + ".aspx";
            string siteUrl = TxtUrl.Text.TrimEnd('/');
            string pageTitle = TxtPageName.Text;
            string pageLibrary = "Pages";
            string pageLayout = "";
            string folderName = TxtFolderName.Text;

            try
            {
                if ((TxtPageName.Text != "" && TxtUrl.Text != "" && TxtFolderName.Text != ""))
                {
                    LblProvisionStatus.Visible = true;
                    LblStatus.AutoSize = true;
                    LblStatus.Text = "Process started...";
                    LblStatus.Refresh();
                    progressBar.Show();
                    //  progressBar.BackColor =System.Drawing.Color.Blue;
                    //  progressBar.Style = ProgressBarStyle.Blocks;
                    NewProgressBar newp = new NewProgressBar();


                    //Progress Bar intialization
                    progressBar.Minimum = 1;
                    progressBar.Maximum = 100;


                    using (var clientContext = new ClientContext(siteUrl))
                    {
                        string userName = "";
                        string pass = "";
                        progressBar.Value = 20;
                        if (siteUrl.Contains("sharepoint.com"))
                        {

                            //To connect SharePoint online with Authentication
                            userName = "murali@chennaitillidsoft.onmicrosoft.com";
                            pass = "ThisIsRight1!";
                            pageLayout = "TillidHomePageLayout";
                            SecureString userPassword = PasswordBuilder(pass);
                            clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);

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

                        }
                        progressBar.Value = 30;
                        Web webSite = clientContext.Web;
                        clientContext.Load(webSite);
                        PublishingWeb web = PublishingWeb.GetPublishingWeb(clientContext, webSite);
                        clientContext.Load(web);
                        if (web != null)
                        {
                            // Get Pages Library

                            LblStatus.Text = "Adding the folder '" + folderName + "'";
                            LblStatus.Refresh();
                            List pages = clientContext.Web.Lists.GetByTitle(pageLibrary);
                            var folder = pages.RootFolder;
                            clientContext.Load(folder);
                            Microsoft.SharePoint.Client.ListItemCollection existingPages = pages.GetItems(CamlQuery.CreateAllItemsQuery());
                            clientContext.Load(existingPages, items => items.Include(item => item.DisplayName).Where(obj => obj.DisplayName == pageTitle));

                            progressBar.Value = 60;
                            folder = folder.Folders.Add(folderName);
                            clientContext.ExecuteQuery();

                            LblStatus.Text = folderName + " folder is added successfully";
                            LblStatus.Refresh();
                            // Check if page already exists    
                            if (existingPages != null && existingPages.Count > 0)
                            {
                                LblStatus.Text = pageTitle + " page already exists.";
                                LblStatus.Refresh();
                            }
                            else
                            {
                                // Get Publishing Page Layouts   

                                LblStatus.Text = "Creating '" + pageTitle + "' page.....";
                                LblStatus.Refresh();
                                List publishingLayouts = clientContext.Site.RootWeb.Lists.GetByTitle("Master Page Gallery");
                                Microsoft.SharePoint.Client.ListItemCollection allItems = publishingLayouts.GetItems(CamlQuery.CreateAllItemsQuery());
                                clientContext.Load(allItems, items => items.Include(item => item.DisplayName).Where(obj => obj.DisplayName == pageLayout));
                                clientContext.ExecuteQuery();
                                progressBar.Value = 80;
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

                                TxtWebpartPage.Text = TxtPageName.Text;

                                #region Populate the values in choose webpart dropdown
                                PopulateWebpartDropDown(clientContext, webSite, pageLibrary, folderName, pageName, DrpdChooseWebpart, progressBar);
                                #endregion

                                #region Populate the values in choose zone dropdown
                                PopulateZoneDropDown(DrpdChooseZone);
                                #endregion

                                progressBar.Value = 100;
                                LblStatus.Text = pageTitle + " page is created successfully";
                                LblStatus.Refresh();
                                progressBar.Hide();
                                LblStatus.Text = "";
                                LblStatus.Refresh();
                                TableAddPage.Visible = false;
                                TableAddWebpart.Visible = true;
                                TxtWebpartPage.ReadOnly = true;
                                BtnSubmit.Visible = false;
                                BtnAddWebPart.Visible = true;
                                LblProvisionStatus.Visible = false;
                                LblHeading.Visible = true;
                                LblHeading.AutoSize = true;
                                LblHeading.Text = "'" + TxtPageName.Text + "' page is created, Add Webparts to this page";
                                LblHeading.Refresh();

                            }
                        }




                    }
                }
                else
                {
                    LblProvisionStatus.Visible = true;
                    if (TxtFolderName.Text == "")
                    {
                        LblStatus.Text = "Please enter a folder name";
                        LblStatus.Refresh();
                    }
                    if (TxtPageName.Text == "")
                    {
                        LblStatus.Text = "Please enter a page name";
                        LblStatus.Refresh();
                    }
                    if (TxtUrl.Text == "")
                    {
                        LblStatus.Text = "Please enter a site url";
                        LblStatus.Refresh();
                    }
                }
            }


            catch
            {
                progressBar.Hide();
                LblStatus.Text = "Please enter a valid site url";
                LblStatus.Refresh();

            }
        }


        private void BtnAddWebPart_Click(object sender, EventArgs e)
        {
            LblProvisionStatus.Visible = true;
            LblStatus.AutoSize = true;
            LblStatus.Text = "Process started...";
            LblStatus.Refresh();
            progressBar.Show();
            //Progress Bar intialization
            progressBar.Minimum = 1;
            progressBar.Maximum = 100;
            progressBar.Value = 1;
            string pageName = TxtPageName.Text + ".aspx";
            string siteUrl = TxtUrl.Text;
            string pageTitle = TxtPageName.Text;
            string pageLibrary = "Pages";
            string pageLayout = "";
            string folderName = TxtFolderName.Text;
            string choosenWebPartTitle = DrpdChooseWebpart.Text;

            string choosenZoneTitle = DrpdChooseZone.Text;
            string choosenZoneID = DrpdChooseZone.SelectedValue.ToString();
            progressBar.Value = 10;
            using (var clientContext = new ClientContext(siteUrl))
            {
                string userName = "";
                string pass = "";

                if (siteUrl.Contains("sharepoint.com"))
                {

                    //To connect SharePoint online with Authentication
                    userName = "murali@chennaitillidsoft.onmicrosoft.com";
                    pass = "ThisIsRight1!";
                    pageLayout = "TillidHomePageLayout";

                    #region Get password using SecureString
                    SecureString userPassword = PasswordBuilder(pass);
                    #endregion

                    clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);

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

                }
                progressBar.Value = 20;
                Web webSite = clientContext.Web;
                clientContext.Load(webSite);
                clientContext.ExecuteQuery();

                // Adding webparts to page
                progressBar.Value = 30;
                string pagePath = webSite.ServerRelativeUrl + "/" + pageLibrary + "/" + folderName + "/" + pageName;

                Microsoft.SharePoint.Client.File page = webSite.GetFileByServerRelativeUrl(pagePath);

                clientContext.Load(page);
                clientContext.ExecuteQuery();
                progressBar.Value = 40;
                LblStatus.Text = "Adding '" + choosenWebPartTitle + "' Webpart to the" + pageTitle + " page";
                LblStatus.Refresh();
                string choosenWebPartFileName = DrpdChooseWebpart.SelectedValue.ToString();

                #region Add choosen webpart to choosen zone of a page
                AddWebPartsToPage(clientContext, page, choosenWebPartTitle, choosenWebPartFileName, choosenZoneID, progressBar, LblStatus);
                #endregion
            }


        }


        public static void PopulateWebpartDropDown(ClientContext clientContext, Web webSite, string pageLibrary, string folderName, string pageName, ComboBox paramChooseWebpart, ProgressBar progressBar)
        {
            string pagePath = webSite.ServerRelativeUrl + "/" + pageLibrary + "/" + folderName + "/" + pageName;

            Microsoft.SharePoint.Client.File page = webSite.GetFileByServerRelativeUrl(pagePath);

            clientContext.Load(page);
            clientContext.ExecuteQuery();

            if (page.CheckOutType != CheckOutType.Online)
            {
                //Check out  
                page.CheckOut();
            }

            #region Get collection of webparts from webpart gallery
            FileCollection files = GetWebParts(page, clientContext, progressBar);
            #endregion

            BindingList<WebPartData> _comboWebpartItems = new BindingList<WebPartData>();
            foreach (Microsoft.SharePoint.Client.File file in files)
            {
                string webPartName = "";

                if (file.Title.Contains("Resources"))
                {
                    webPartName = file.Title.Split(',')[1].Replace(";", "").Replace(" - ", "_").Trim();
                }
                else
                {
                    webPartName = file.Title.Replace(" - ", "_").Trim();
                }
                string webPartFileName = file.Name;
                _comboWebpartItems.Add(new WebPartData { Text = webPartName, Value = webPartFileName });
                List<WebPartData> sortedList = _comboWebpartItems.OrderBy(sortItems => sortItems.Text).ToList();

                _comboWebpartItems = new BindingList<WebPartData>(sortedList);
            }
            paramChooseWebpart.DataSource = _comboWebpartItems;
            paramChooseWebpart.DisplayMember = "Text";
            paramChooseWebpart.ValueMember = "Value";




        }

        public static void PopulateZoneDropDown(ComboBox drpID)
        {
            List<string> listZoneId = new List<string>();
            List<string> listZoneTitle = new List<string>();
            List<string> listZoneConfig = PageWithPageLayoutsAndWebparts.Constants.ZoneConfiguration();
            BindingList<ZoneData> _comboZoneItems = new BindingList<ZoneData>();
            if (listZoneConfig.Count > 0)
            {
                foreach (var item in listZoneConfig)
                {


                    _comboZoneItems.Add(new ZoneData { Text = item.Split('|')[1], Value = item.Split('|')[0] });



                }
                drpID.DataSource = _comboZoneItems;
                drpID.DisplayMember = "Text";
                drpID.ValueMember = "Value";


            }

        }

        // Password builder based on type of sharepoint environment



        public static void AddWebPartsToPage(ClientContext ctx, Microsoft.SharePoint.Client.File currentPage, string webPartTitle, string webPartFileName, string zoneID, ProgressBar progressBar, Label LblStatus)
        {

            // Gets the webparts available on the page
            var wpm = currentPage.GetLimitedWebPartManager(PersonalizationScope.Shared);
            ctx.Load(wpm.WebParts,
                wps => wps.Include(wp => wp.WebPart.Title));
            ctx.ExecuteQuery();
            progressBar.Value = 60;
            var availableWebparts = wpm.WebParts;
            // Check if the current webpart already exists.  
            var filteredWebParts = from isWPAvail in availableWebparts
                                   where isWPAvail.WebPart.Title == webPartTitle
                                   select isWPAvail;
            if (filteredWebParts.Count() <= 0)
            {
                List list = ctx.Site.RootWeb.Lists.GetByTitle("Web Part Gallery");
                ctx.Load(list);

                Folder gallery = list.RootFolder;
                FileCollection files = gallery.Files;
                ctx.Load(files);
                ctx.ExecuteQuery();
                progressBar.Value = 80;
                foreach (Microsoft.SharePoint.Client.File file in files)
                {
                    try
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
                                    LblStatus.Text = "'" + webPartTitle + "' Webpart added successfully";
                                    LblStatus.Refresh();
                                    progressBar.Value = 100;

                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }

                }
            }


        }



        public static FileCollection GetWebParts(Microsoft.SharePoint.Client.File page, ClientContext ctx, ProgressBar progressBar)
        {
            var wpm = page.GetLimitedWebPartManager(PersonalizationScope.Shared);
            ctx.Load(wpm.WebParts,
                wps => wps.Include(wp => wp.WebPart.Title));
            ctx.ExecuteQuery();
            progressBar.Value = 60;


            List list = ctx.Site.RootWeb.Lists.GetByTitle("Web Part Gallery");
            ctx.Load(list);

            Folder gallery = list.RootFolder;
            FileCollection files = gallery.Files;
            ctx.Load(files);
            ctx.ExecuteQuery();
            return files;

        }

        //class for BindingList Collection
        public class WebPartData
        {
            public string Text { get; set; }
            public string Value { get; set; }

        }

        //class for BindingList Collection
        public class ZoneData
        {
            public string Text { get; set; }
            public string Value { get; set; }

        }




        public static SecureString PasswordBuilder(string pass)
        {
            SecureString password = new SecureString();
            for (var i = 0; i < pass.Length; i++)
            {
                password.AppendChar(pass[i]);
            }
            return password;
        }

        public static void GetWebPartZones(string siteUrl, ProgressBar progressBar, ComboBox DropdownZones)
        {
            using (var clientContext = new ClientContext(siteUrl))
            {
                string userName = "";
                string pass = "";
                //string pageName = TxtPageName.Text + ".aspx";
                //string siteUrl = TxtUrl.Text.TrimEnd('/');
                //string pageTitle = TxtPageName.Text;
                //string pageLibrary = "Pages";
                string pageLayout = "";
                //string folderName = TxtFolderName.Text;
                progressBar.Value = 20;
                if (siteUrl.Contains("sharepoint.com"))
                {

                    //To connect SharePoint online with Authentication
                    userName = "murali@chennaitillidsoft.onmicrosoft.com";
                    pass = "ThisIsRight1!";
                    pageLayout = "TillidHomePageLayout";
                    SecureString userPassword = PasswordBuilder(pass);
                    clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);

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

                }

                Web webSite = clientContext.Web;
                clientContext.Load(webSite);
                clientContext.ExecuteQuery();

                //// Adding webparts to page
                //progressBar.Value = 30;
                //string pagePath = webSite.ServerRelativeUrl + "/" + pageLibrary + "/" + folderName + "/" + pageName;

                //Microsoft.SharePoint.Client.File page = webSite.GetFileByServerRelativeUrl(pagePath);

                //clientContext.Load(page);
                //clientContext.ExecuteQuery();
                string pageLayoutPath = "/_catalogs/masterpage/" + pageLayout+".aspx";
                GetWebPartPage(clientContext, pageLayoutPath, DropdownZones);

            }

        }


        public static void GetWebPartPage(ClientContext context, string pageLayoutPath,ComboBox DropdownZones)

        {

            //File file = context.Sites.Web.GetFile("SitePages/test.aspx");
            File file = context.Site.RootWeb.GetFileByServerRelativeUrl(pageLayoutPath);
            context.Load(file);
            context.ExecuteQuery();
            //string sourceCode = System.Text.Encoding.UTF8.GetString(file.OpenBinary());
            FileInformation fileInformation = Microsoft.SharePoint.Client.File.OpenBinaryDirect(context, (string)file.ServerRelativeUrl);
            System.IO.StreamReader sr = new System.IO.StreamReader(fileInformation.Stream);            
            string sourceCode = sr.ReadToEnd().ToString();

            List<string> webPartZoneStr = new List<string>();
            //List<HtmlElement> webPartZoneHtml = new List<HtmlElement>();

            FindWebPartString(webPartZoneStr, sourceCode);
             
            BindingList<ZoneData> _comboZoneItems = new BindingList<ZoneData>();
            foreach (string str in webPartZoneStr)

            {

                XmlDocument doc = new XmlDocument();
                doc.LoadXml(str);
                XmlElement root = doc.DocumentElement;
                string id = root.GetAttribute("id");
                string text= root.GetAttribute("title");

                _comboZoneItems.Add(new ZoneData { Text = text, Value = id });

                
            }
            DropdownZones.DataSource = _comboZoneItems;
            DropdownZones.DisplayMember = "Text";
            DropdownZones.ValueMember = "Value";

        }



        public static void FindWebPartString(List<string> strCol, string src)

        {

            if (src.IndexOf("<WebPartPages:WebPartZone") > -1)

            {
                try
                {
                    src = src.Substring(src.IndexOf("<WebPartPages:WebPartZone"));
                    string strValue = src.Substring(0, src.IndexOf("Zone>") + 5);
                    strCol.Add(strValue);
                    //XmlDocument doc = new XmlDocument();
                    //doc.LoadXml(htmlValue);
                    //XmlElement root = doc.DocumentElement;
                    //string id = root.Attributes["id"].Value;
                    //string title = root.Attributes["title"].Value;
                    string newStr = src.Substring(src.IndexOf(">/") + 2);
                    FindWebPartString(strCol, newStr);

                }
                catch(Exception e) {
                    MessageBox.Show(e.Message);
                }
                

            }

            else

            {

                return;

            }

        }

    }


    // Customizing Progress Bar
    public class NewProgressBar : ProgressBar
    {
        public NewProgressBar()
        {
            this.SetStyle(ControlStyles.UserPaint, true);
        }

        protected override void OnPaintBackground(PaintEventArgs pevent)
        {
            // None... Helps control the flicker.
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            const int inset = 2; // A single inset value to control teh sizing of the inner rect.

            using (Image offscreenImage = new Bitmap(this.Width, this.Height))
            {
                using (Graphics offscreen = Graphics.FromImage(offscreenImage))
                {
                    Rectangle rect = new Rectangle(0, 0, this.Width, this.Height);

                    if (ProgressBarRenderer.IsSupported)
                        ProgressBarRenderer.DrawHorizontalBar(offscreen, rect);

                    rect.Inflate(new Size(-inset, -inset)); // Deflate inner rect.
                    rect.Width = (int)(rect.Width * ((double)this.Value / this.Maximum));
                    if (rect.Width == 0) rect.Width = 1; // Can't draw rec with width of 0.

                    LinearGradientBrush brush = new LinearGradientBrush(rect, this.BackColor, System.Drawing.Color.RoyalBlue, LinearGradientMode.Vertical);
                    offscreen.FillRectangle(brush, inset, inset, rect.Width, rect.Height);

                    e.Graphics.DrawImage(offscreenImage, 0, 0);
                    offscreenImage.Dispose();
                }
            }
        }

        protected void OnPaintBackup(PaintEventArgs e)
        {
            const int inset = 2; // A single inset value to control teh sizing of the inner rect.

            using (Image offscreenImage = new Bitmap(this.Width, this.Height))
            {
                using (Graphics offscreen = Graphics.FromImage(offscreenImage))
                {
                    Rectangle rect = new Rectangle(0, 0, this.Width, this.Height);

                    if (ProgressBarRenderer.IsSupported)
                        ProgressBarRenderer.DrawHorizontalBar(offscreen, rect);

                    rect.Inflate(new Size(-inset, -inset)); // Deflate inner rect.
                    rect.Width = (int)(rect.Width * ((double)this.Value / this.Maximum));
                    if (rect.Width == 0) rect.Width = 1; // Can't draw rec with width of 0.

                    LinearGradientBrush brush = new LinearGradientBrush(rect, this.BackColor, this.ForeColor, LinearGradientMode.Vertical);
                    offscreen.FillRectangle(brush, inset, inset, rect.Width, rect.Height);

                    e.Graphics.DrawImage(offscreenImage, 0, 0);
                    offscreenImage.Dispose();
                }
            }
        }
    }
}







