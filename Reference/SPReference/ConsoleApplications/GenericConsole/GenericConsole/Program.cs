using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using System.Security;

namespace GenericConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var userName = "murali@chennaitillidsoft.onmicrosoft.com";
            var pass = "ThisIsRight1!";
            //var listTitle = "NewLocationList";
            //var listTemplateName = "CustomLocationList.stp";
            SecureString userPassword = PasswordBuilder(pass);
            var pageUrl = "https://chennaitillidsoft.sharepoint.com/sites/oct9_QA1/";

            using (var clientContext = new ClientContext(pageUrl))
            {
                clientContext.Credentials = new SharePointOnlineCredentials(userName, userPassword);
                AddUserToGroup(clientContext, userName);
                //AddSPUserToList(clientContext);

                //CreateListOverTemplate(clientContext, listTitle, listTemplateName);

                //AssignMultipleValuesToChoiceField(clientContext);
            }


        }
        #region Add user to existing group
        public static void AddUserToGroup(ClientContext context, string userName)
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
                    User member = web.EnsureUser(@userName);
                    group.Users.AddUser(member);
                    group.Update();
                    context.ExecuteQuery();
                    
                }
               
            }
            catch (Exception ex)
            {

            }
        }
        #endregion

        #region Add user to a list
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
            catch(Exception ex)
            {

            }
        }
        #endregion

        // Create a list from list template
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
        // Password builder based on type of sharepoint environment
        private static SecureString PasswordBuilder(string currentPassword)
        {
            SecureString password = new SecureString();
            for (var i = 0; i < currentPassword.Length; i++)
            {
                password.AppendChar(currentPassword[i]);
            }
            return password;
        }

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

    }
}


