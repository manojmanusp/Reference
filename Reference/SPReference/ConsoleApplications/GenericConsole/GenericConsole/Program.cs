using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using System.Security;
using Microsoft.SharePoint.Client.WebParts;

namespace GenericConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var userName = "murali@chennaitillidsoft.onmicrosoft.com";
            string[] users = new string[] { "murali@chennaitillidsoft.onmicrosoft.com", "murali@chennaitillidsoft.onmicrosoft.com", "murali@chennaitillidsoft.onmicrosoft.com" };
            var pass = "ThisIsRight1!";
            //var listTitle = "NewLocationList";
            //var listTemplateName = "CustomLocationList.stp";
            SecureString userPassword = PasswordBuilder(pass);
            var pageUrl = "https://chennaitillidsoft.sharepoint.com/sites/oct9_QA1/";
            var listName = "PostList";
            var pagePath = "/Pages/CustomNewPages/New6.aspx";
            string permissionLevelName = "Contribute";
            using (var clientContext = new ClientContext(pageUrl))
            {
                clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);
                HideColumnsinContentType(clientContext);
                //AddLookUpToList(clientContext, "ListA", "ListB", "LookupTest2", "Title", "multi");
                //CreateAGroup(clientContext, permissionLevelName,"DemoGroup2","This group with permission level");
                //CreateList(clientContext,"ListA");
                //SetUpCurrentNavigation(clientContext);
                //DeleteItems(clientContext);
                //DeleteItemsInCurrentNavigation(clientContext);
                //UpdateCurrentNavigation(clientContext);
                //UpdateValidationSettingsOfList(clientContext);
                //AddingSharePointListWPToPage(clientContext);
                //DeleteAllWebpartsFromPage(clientContext, pagePath);
                // GetAllViewsFromList(clientContext, listName);
                //AddUserToGroup(clientContext, userName, users);
                //AddSPUserToList(clientContext);

                //CreateListOverTemplate(clientContext, listTitle, listTemplateName);

                //AssignMultipleValuesToChoiceField(clientContext);
            }


        }


        #region Add user to existing group
        /// <summary>
        /// Add user to a existing group
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        /// <param name="users">collection of users</param>
        public static void AddUserToGroup(ClientContext context, string[] users)
        {
            try
            {
                Web web = context.Web;
                string groupTitle = "Secretaries";
                Group group = web.SiteGroups.GetByName(groupTitle);
                context.Load(group);
                context.ExecuteQuery();


                if (group.Title == groupTitle)
                {
                    //User member = web.EnsureUser(userName);
                    //group.Users.AddUser(member);
                    foreach (string user in users)
                    {
                        User member = web.EnsureUser(user);
                        group.Users.AddUser(member);

                    }
                    group.Update();
                    context.Load(group);
                    context.ExecuteQuery();

                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        #endregion

        #region Add user to a list
        /// <summary>
        /// Add user to a existing list
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        public static void AddSPUserToList(ClientContext context)
        {
            try
            {
                var itemId = 1;
                var listName = "SecretariesList";
                var userId = 8;
                var list = context.Web.Lists.GetByTitle(listName);
                var item = list.GetItemById(itemId);
                var userValue = new FieldUserValue() { LookupId = userId }; // for single user
                var userValues = new[] { userValue, userValue, userValue }; // for multiple users
                item["Secretary"] = userValue;
                item["Secretaries"] = userValues;
                item.Update();
                context.ExecuteQuery();

            }
            catch (Exception ex)
            {

            }
        }
        #endregion

        #region Create a list based on template
        /// <summary>
        /// Creates a new list based on template specified
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        /// <param name="listTitle">Custom title for new list</param>
        /// <param name="listTemplateName">Name of the template</param>
        private static void CreateListOverTemplate(ClientContext context, string listTitle, string listTemplateName)
        {
            Web webSite = context.Web;
            Console.WriteLine("Process Started....");

            ListTemplate template = null;
            ListTemplateCollection templateCollection = context.Site.GetCustomListTemplates(context.Web);
            context.Load(templateCollection);
            context.ExecuteQuery();
            foreach (ListTemplate listTemplate in templateCollection)
            {
                Console.WriteLine(listTemplate.InternalName);

                if (listTemplate.InternalName == listTemplateName)
                {
                    template = listTemplate;
                    break;
                }
            }
            //ListCollection collList = context.Site.RootWeb.Lists;
            ListCreationInformation info = new ListCreationInformation();

            info.Title = listTitle;
            info.ListTemplate = template;
            info.TemplateFeatureId = template.FeatureId;
            info.TemplateType = template.ListTemplateTypeKind;
            //info.QuickLaunchOption = QuickLaunchOptions.DefaultValue;
            webSite.Lists.Add(info);
            context.Load(webSite);
            context.ExecuteQuery();
            Console.WriteLine("List created successfully");
            Console.ReadLine();
        }
        #endregion

        #region Password builder based on type of sharepoint environment
        /// <summary>
        /// Password builder for credentials using security string
        /// </summary>
        /// <param name="currentPassword">Password for the current logging user</param>
        /// <returns>Password in the form of security string</returns>
        private static SecureString PasswordBuilder(string currentPassword)
        {
            SecureString password = new SecureString();
            for (var i = 0; i < currentPassword.Length; i++)
            {
                password.AppendChar(currentPassword[i]);
            }
            return password;
        }
        #endregion

        #region Assign multiple values to a choice field
        /// <summary>
        /// Assign multiple values to a choice field
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        private static void AssignMultipleValuesToChoiceField(ClientContext context)
        {
            var listName = "List";
            var choiceFieldName = "CustomChoiceColumn";
            string[] choiceValues = new string[] { "one", "two", "three" };
            Web web = context.Web;

            // Get the list by Title  
            List list = web.Lists.GetByTitle(listName);

            // Get a specific field by Title  
            Field field = list.Fields.GetByTitle(choiceFieldName);
            FieldChoice fieldChoice = context.CastTo<FieldChoice>(field);
            context.Load(fieldChoice);

            // Execute the query to the server  
            context.ExecuteQuery();

            // Add the choice field values  
            List<string> options = new List<string>(fieldChoice.Choices);
            options.Clear();
            for (int i = 0; i < choiceValues.Length; i++)
            {
                options.Add(choiceValues[i]);
            }

            fieldChoice.Choices = options.ToArray();

            // Update the choice field  
            fieldChoice.Update();

            // Execute the query to the server  
            context.ExecuteQuery();

        }
        #endregion

        #region Get all views from a list
        /// <summary>
        /// Get all views from a list
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        /// <param name="listName">Name of the list</param>
        private static void GetAllViewsFromList(ClientContext context, string listName)
        {
            Web web = context.Web;

            List list = web.Lists.GetByTitle(listName);
            ViewCollection viewColl = list.Views;
            //context.Load(viewColl,views => views.Include(view => view.Title,view => view.Id));
            context.Load(viewColl);
            context.Load(web);
            context.ExecuteQuery();
            foreach (View view in viewColl)
            {
                //Console.WriteLine(view.Title + "--------" + view.Id+"_____"+ view.ServerRelativeUrl);
                Console.WriteLine(web.Url + view.ServerRelativeUrl);
            }
            Console.ReadLine();
        }
        #endregion

        #region Delete all webparts existing in a sharepoint page
        /// <summary>
        /// Delete all webparts existing in a sharepoint page
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        /// <param name="pagePath">Path of the page like "/Pages/Folder/Pagename.aspx"</param>
        private static void DeleteAllWebpartsFromPage(ClientContext context, string pagePath)
        {
            Web web = context.Web;
            context.Load(web);
            context.ExecuteQuery();
            File file = context.Web.GetFileByServerRelativeUrl(web.ServerRelativeUrl + pagePath);
            LimitedWebPartManager wpm = file.GetLimitedWebPartManager(PersonalizationScope.Shared);

            context.Load(wpm.WebParts);
            context.ExecuteQuery();
            foreach (WebPartDefinition wpd in wpm.WebParts)
            {
                WebPart wp = wpd.WebPart;
                wpd.DeleteWebPart();
                context.ExecuteQuery();
            }
            Console.WriteLine("Webparts deleted successfully");
            Console.ReadLine();

        }
        #endregion

        #region Add a list webpart to a sharepoint page
        /// <summary>
        /// Add a list webpart to a sharepoint page
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        private static void AddingSharePointListWPToPage(ClientContext context)
        {
            string pageUrl = "/sites/oct9_QA1/SitePages/Home.aspx";
            // mark object you would like to access
            var list = context.Web.Lists.GetByTitle("PostList");
            // prepare load query with SchemaXml property
            context.Load(list, l => l.SchemaXml);
            context.ExecuteQuery(); // request the data
            AddWebPart(context, pageUrl, list.SchemaXml);
        }
        #endregion

        #region Add a webpart to a page
        /// <summary>
        /// Add a webpart to a page
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        /// <param name="pageUrl">Url of the page</param>
        /// <param name="xml">Xml of the webpart as string</param>
        private static void AddWebPart(ClientContext context, string pageUrl, string xml)
        {
            var page = context.Web.GetFileByServerRelativeUrl(pageUrl);
            var webpartManager = page.GetLimitedWebPartManager(PersonalizationScope.Shared);
            context.Load(webpartManager);
            context.Load(webpartManager.WebParts);
            context.ExecuteQuery();
            WebPartDefinition webpartDef = webpartManager.ImportWebPart(xml);
            WebPartDefinition webpart = webpartManager.AddWebPart(webpartDef.WebPart, "mainContent", 0);
            context.Load(webpartDef);
            context.ExecuteQuery();
            Console.WriteLine("Webpart Added successfully");
            Console.ReadLine();

        }
        #endregion

        #region Update validation settings of a list
        /// <summary>
        /// Update validation settings of a list
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        private static void UpdateValidationSettingsOfList(ClientContext context)
        {
            Web web = context.Web;
            var list = web.Lists.GetByTitle("PostList");
            list.ValidationFormula = "[Created]=[Modified]";
            list.ValidationMessage = "Validating the user";
            list.Update();
            context.Load(list);
            context.ExecuteQuery();
            Console.WriteLine("Validation settings updated");
            Console.ReadLine();

        }
        #endregion


        private static void UpdateCurrentNavigation(ClientContext context)
        {
            //Web web = context.Web;

            //NavigationNodeCollection quickLaunch = web.Navigation.QuickLaunch;
            //NavigationNodeCollection targetTopColl = web.Navigation.QuickLaunch;
            //context.Load(web);
            //context.Load(quickLaunch);
            ////context.Load(targetTopColl);
            //context.ExecuteQuery();
            ////NavigationNodeCreationInformation link = new NavigationNodeCreationInformation();            
            ////link.Title = "LocationList";
            ////link.Url = web.ServerRelativeUrl+"/Pages/LocationListKendo.aspx";
            ////link.AsLastNode = true;
            ////quickLaunch.Add(link);
            ////context.Load(quickLaunch);
            ////context.ExecuteQuery();
            ////Console.WriteLine("Current Navigation Updated");
            ////Console.ReadLine();
            ////Copy Top Level Nodes
            ////Console.WriteLine(context.Web.ServerRelativeUrl);
            //foreach (NavigationNode node in quickLaunch.ToList())
            //{
            //    //Create Top Level nodes
            //    if (node.Url.Contains(".aspx"))
            //    {
            //        Console.WriteLine(node.Title);
            //        NavigationNodeCreationInformation nodeCreation = new NavigationNodeCreationInformation();
            //        nodeCreation.Title = node.Title;
            //        nodeCreation.AsLastNode = true;
            //        nodeCreation.IsExternal = true;

            //        targetTopColl.Add(nodeCreation);
            //        context.ExecuteQuery();
            //    }
            //    else if (!node.Url.Contains(context.Web.ServerRelativeUrl))
            //    {
            //        Console.WriteLine(node.Title);
            //        NavigationNodeCreationInformation nodeCreation = new NavigationNodeCreationInformation();
            //        nodeCreation.Title = node.Title;
            //        nodeCreation.Url = node.Url;
            //        nodeCreation.IsExternal = true;
            //        nodeCreation.AsLastNode = true;
            //        targetTopColl.Add(nodeCreation);
            //        context.ExecuteQuery();
            //    }

            //}

            ////Copy Sub Nodes
            //foreach (NavigationNode node in quickLaunch.ToList())
            //{
            //    //Load child nodes
            //    NavigationNodeCollection subNodes = node.Children;
            //    context.Load(subNodes);
            //    context.ExecuteQuery();

            //    foreach (NavigationNode targNode in targetTopColl.ToList())
            //    {
            //        if (node.Title == targNode.Title)
            //        {
            //            foreach (NavigationNode subNode in subNodes.ToList())
            //            {
            //                NavigationNodeCreationInformation nodeCreation = new NavigationNodeCreationInformation();
            //                nodeCreation.Title = subNode.Title;
            //                nodeCreation.Url = subNode.Url;
            //                nodeCreation.IsExternal = true;
            //                nodeCreation.AsLastNode = true;
            //                targNode.Children.Add(nodeCreation);
            //            }
            //        }
            //    }
            //}
            //context.ExecuteQuery();
            string newparentNode = "Reminders";
            string[] childNodes = { "one", "two", "three", "four" };



            context.Load(context.Web);
            context.ExecuteQuery();
            NavigationNodeCollection qlNavNodeColl = context.Web.Navigation.QuickLaunch;

            NavigationNodeCreationInformation parentNode = new NavigationNodeCreationInformation();
            parentNode.Title = newparentNode;
            parentNode.Url = "https://www.google.com";
            NavigationNode ParentNode = qlNavNodeColl.Add(parentNode);
            for (var i = 0; i < childNodes.Count(); i++)
            {
                NavigationNodeCreationInformation childNode = new NavigationNodeCreationInformation();
                childNode.Title = "Active" + i;
                childNode.Url = "https://www.google.com";
                ParentNode.Children.Add(childNode);
            }
            context.Load(qlNavNodeColl);
            context.ExecuteQuery();
            Console.WriteLine("Quick Launch configured");
            Console.ReadLine();

        }
        private static void DeleteItemsInCurrentNavigation(ClientContext context)
        {
            context.Load(context.Web);
            NavigationNodeCollection qlNavNodeColl = context.Web.Navigation.QuickLaunch;
            context.Load(qlNavNodeColl);
            context.ExecuteQuery();
            foreach (NavigationNode node in qlNavNodeColl.ToList())
            {
                if (node.Url.Contains(".aspx"))
                {
                    node.DeleteObject();
                }
            }
            context.ExecuteQuery();
            Console.WriteLine("Links in Current Navigation deleted successfully");
            Console.ReadLine();
        }

        #region Setting up the current navigation of a site
        /// <summary>
        /// Setting up the current navigation of a site
        /// </summary>
        /// <param name="clientContext">client context of a specific site</param>
        private static void SetUpCurrentNavigation(ClientContext clientContext)
        {

            string newparentNode = "Reminders";
            string[] childNodes = { "one", "two", "three", "four" };
            //string siteUrl = "https://chennaitillidsoft.sharepoint.com/sites/branding/Navigation";
            //ClientContext clientContext = new ClientContext(siteUrl);
            //SecureString passWord = new SecureString();
            //foreach (char c in "ThisIsRight1!".ToCharArray()) passWord.AppendChar(c);
            //clientContext.Credentials = new SharePointOnlineCredentials("murali@chennaitillidsoft.onmicrosoft.com", passWord);

            clientContext.Load(clientContext.Web);
            clientContext.ExecuteQuery();
            NavigationNodeCollection qlNavNodeColl = clientContext.Web.Navigation.QuickLaunch;
            clientContext.Load(qlNavNodeColl);
            clientContext.ExecuteQuery();
            clientContext.Dispose();
            for (int ii = qlNavNodeColl.Count - 1; ii >= 0; ii--)
            {
                //if (qlNavNodeColl[ii].Title == "Home")
                //{
                Console.WriteLine(qlNavNodeColl[ii].Title + "Deleted");
                qlNavNodeColl[ii].DeleteObject();

                // }

            }
            clientContext.ExecuteQuery();

            NavigationNodeCreationInformation parentNode = new NavigationNodeCreationInformation();
            parentNode.Title = newparentNode;
            parentNode.Url = "https://www.google.com";
            NavigationNode ParentNode = qlNavNodeColl.Add(parentNode);
            foreach (string child in childNodes)
            {
                NavigationNodeCreationInformation childNode = new NavigationNodeCreationInformation();
                childNode.Title = child;
                childNode.Url = "https://www.google.com";
                ParentNode.Children.Add(childNode);
                Console.WriteLine(child + "Added");
            }
            NavigationNodeCreationInformation parentNode2 = new NavigationNodeCreationInformation();
            parentNode2.Title = "Home";
            parentNode2.Url = "https://www.facebook.com";
            qlNavNodeColl.Add(parentNode2);
            clientContext.Load(qlNavNodeColl);
            clientContext.ExecuteQuery();
            Console.ReadLine();
        }
        #endregion

        #region Create a group with a permission in a site
        /// <summary>
        /// Creates a group with a permission in a site
        /// </summary>
        /// <param name="ctx">client context of a specific site</param>
        /// <param name="permissionLevelName">Name of the permission</param>
        /// <param name="groupName">Name of the group</param>
        /// <param name="groupDesc">Description of the group</param>
        private static void CreateAGroup(ClientContext ctx, string permissionLevelName, string groupName, string groupDesc)
        {
            try
            {
                //create the group                
                Web web = ctx.Web;
                GroupCreationInformation grp = new GroupCreationInformation();
                grp.Title = groupName;
                grp.Description = groupDesc;
                //add it to the list of site groups
                Group newgrp = ctx.Web.SiteGroups.Add(grp);
                //Breaking the role inheritance from parent site
                web.BreakRoleInheritance(true, false);
                //Get a role.
                RoleDefinition rd = ctx.Web.RoleDefinitions.GetByName(permissionLevelName); // – > To Create a Custom Role definition or Permission level
                //create the role definition binding collection
                RoleDefinitionBindingCollection rdb = new RoleDefinitionBindingCollection(ctx);
                //add the role definition to the collection
                rdb.Add(rd);
                //create a RoleAssigment with the group and role definition
                ctx.Web.RoleAssignments.Add(newgrp, rdb);
                //execute the query to add everything
                ctx.Load(newgrp);
                ctx.ExecuteQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }
        #endregion

        #region Create a custom list
        /// <summary>
        /// Create a custom list
        /// </summary>
        /// <param name="clientContext">client context of a specific site</param>
        /// <param name="listName">Custom list name</param>
        public static void CreateList(ClientContext clientContext, string listName)
        {
            try
            {
                ListCreationInformation creationInfo = new ListCreationInformation();
                creationInfo.Title = listName;
                //creationInfo.Description = "new list created using VS 2012 &CSOM";
                creationInfo.TemplateType = (int)ListTemplateType.GenericList;
                // Create a new custom list    

                List newList = clientContext.Web.Lists.Add(creationInfo);
                // Retrieve the custom list properties    
                clientContext.Load(newList);
                // Execute the query to the server.    
                clientContext.ExecuteQuery();
                // Display the custom list Title property    
                Console.WriteLine(newList.Title);
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }
        #endregion

        #region Add lookup field to target list
        /// <summary>
        /// Add lookup field to target list
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        /// <param name="primaryList">Primary list name</param>
        /// <param name="secondaryList">Secondary list name</param>
        /// <param name="lookupFieldName">lookup field for secondary list</param>
        /// <param name="parentFieldName">Field from primary list for lookup field in secondary list</param>
        /// <param name="lookupType">Type of lookup like "multi"</param>
        public static void AddLookUpToList(ClientContext context, string primaryList, string secondaryList, string lookupFieldName, string parentFieldName, string lookupType)
        {
            try
            {
                string schemaLookupField = "";
                Web web = context.Web;

                List booksList = context.Web.Lists.GetByTitle(primaryList);

                List list = context.Web.Lists.GetByTitle(secondaryList);

                context.Load(list, l => l.Fields);
                context.Load(booksList, b => b.Id);
                context.ExecuteQuery();
                if (lookupType.ToLower() == "multi")
                {
                    schemaLookupField = @"<Field Type='LookupMulti' Name='" + lookupFieldName + "' StaticName='" + lookupFieldName + "' DisplayName='" + lookupFieldName + "' List='" + booksList.Id + "' ShowField = '" + parentFieldName + "' Mult='TRUE' />";
                }
                else
                {
                    schemaLookupField = @"<Field Type='Lookup' Name='LookUpMultiTitle' StaticName='LookUpMultiTitle' DisplayName='LookUpMultiTitle' List='" + booksList.Id + "' ShowField = 'Title' />";
                }

                Field lookupField = list.Fields.AddFieldAsXml(schemaLookupField, true, AddFieldOptions.DefaultValue);
                lookupField.Update();

                context.Load(lookupField);
                context.ExecuteQuery();
                Console.WriteLine("Lookup created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }
        #endregion

        #region Hide columns of a contenttype
        /// <summary>
        /// Hide columns of a contenttype
        /// </summary>
        /// <param name="context">client context of a specific site</param>
        public static void HideColumnsinContentType(ClientContext context)
        {
            string[] ContentTypeColumnNames = new string[] { "Title" };
            List list = context.Web.Lists.GetByTitle("ListB");
            context.Load(list);
            var currContentType = context.LoadQuery(list.ContentTypes.Where(ct => ct.Name == "Item"));
            context.ExecuteQuery();
            ContentType contentType = (ContentType)currContentType.FirstOrDefault();
            context.Load(contentType);
            context.Load(contentType.Fields);
            context.Load(contentType.FieldLinks);
            context.ExecuteQuery();

            foreach (FieldLink fieldLink in contentType.FieldLinks)
            {
                if (ContentTypeColumnNames.Contains(fieldLink.Name))
                {
                    fieldLink.Hidden = true;
                    contentType.Update(false);
                    context.ExecuteQuery();
                }
            }

            context.Load(contentType);
            context.ExecuteQuery();
            Console.WriteLine("Hidden Option enabled");

        }
        #endregion
    }
}


