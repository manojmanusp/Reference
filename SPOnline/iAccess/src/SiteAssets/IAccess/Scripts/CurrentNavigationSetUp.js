function SetUpCurrentNavigation(clientContext)
        {
            var context = new SP.ClientContext.get_current();

            Web web = context.Web;
            var list = web.Lists.GetByTitle("PostList");
            list.ValidationFormula = "[Created]=[Modified]";
            list.ValidationMessage = "Validating the user";
            list.Update();
            context.Load(list);
            context.ExecuteQuery();
            
        }