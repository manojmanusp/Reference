namespace PageWithPageLayout
{
    partial class CreateNewPage
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.BtnSubmit = new System.Windows.Forms.Button();
            this.progressBar = new System.Windows.Forms.ProgressBar();
            this.LblStatus = new System.Windows.Forms.Label();
            this.LabelStatus = new System.Windows.Forms.Label();
            this.TableAddPage = new System.Windows.Forms.TableLayoutPanel();
            this.LblFolderName = new System.Windows.Forms.Label();
            this.LblPageName = new System.Windows.Forms.Label();
            this.LblUrl = new System.Windows.Forms.Label();
            this.TxtUrl = new System.Windows.Forms.TextBox();
            this.TxtPageName = new System.Windows.Forms.TextBox();
            this.TxtFolderName = new System.Windows.Forms.TextBox();
            this.TableAddWebpart = new System.Windows.Forms.TableLayoutPanel();
            this.LblChooseZone = new System.Windows.Forms.Label();
            this.LblChooseWebpart = new System.Windows.Forms.Label();
            this.LblWebpartPage = new System.Windows.Forms.Label();
            this.TxtWebpartPage = new System.Windows.Forms.TextBox();
            this.DrpdChooseWebpart = new System.Windows.Forms.ComboBox();
            this.DrpdChooseZone = new System.Windows.Forms.ComboBox();
            this.TableAddPage.SuspendLayout();
            this.TableAddWebpart.SuspendLayout();
            this.SuspendLayout();
            // 
            // BtnSubmit
            // 
            this.BtnSubmit.Location = new System.Drawing.Point(238, 186);
            this.BtnSubmit.Name = "BtnSubmit";
            this.BtnSubmit.Size = new System.Drawing.Size(75, 23);
            this.BtnSubmit.TabIndex = 4;
            this.BtnSubmit.Text = "Submit";
            this.BtnSubmit.UseVisualStyleBackColor = true;
            this.BtnSubmit.Click += new System.EventHandler(this.BtnSubmit_Click);
            // 
            // progressBar
            // 
            this.progressBar.Enabled = false;
            this.progressBar.Location = new System.Drawing.Point(165, 226);
            this.progressBar.Name = "progressBar";
            this.progressBar.Size = new System.Drawing.Size(222, 23);
            this.progressBar.TabIndex = 7;
            this.progressBar.Visible = false;
            // 
            // LblStatus
            // 
            this.LblStatus.AutoSize = true;
            this.LblStatus.Location = new System.Drawing.Point(165, 268);
            this.LblStatus.Name = "LblStatus";
            this.LblStatus.Size = new System.Drawing.Size(0, 13);
            this.LblStatus.TabIndex = 8;
            // 
            // LabelStatus
            // 
            this.LabelStatus.AutoSize = true;
            this.LabelStatus.Location = new System.Drawing.Point(91, 268);
            this.LabelStatus.Name = "LabelStatus";
            this.LabelStatus.Size = new System.Drawing.Size(0, 13);
            this.LabelStatus.TabIndex = 9;
            // 
            // TableAddPage
            // 
            this.TableAddPage.ColumnCount = 2;
            this.TableAddPage.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 22.48062F));
            this.TableAddPage.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 77.51938F));
            this.TableAddPage.Controls.Add(this.LblFolderName, 0, 2);
            this.TableAddPage.Controls.Add(this.LblPageName, 0, 1);
            this.TableAddPage.Controls.Add(this.LblUrl, 0, 0);
            this.TableAddPage.Controls.Add(this.TxtUrl, 1, 0);
            this.TableAddPage.Controls.Add(this.TxtPageName, 1, 1);
            this.TableAddPage.Controls.Add(this.TxtFolderName, 1, 2);
            this.TableAddPage.Location = new System.Drawing.Point(94, 24);
            this.TableAddPage.Name = "TableAddPage";
            this.TableAddPage.RowCount = 3;
            this.TableAddPage.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddPage.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddPage.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 45F));
            this.TableAddPage.Size = new System.Drawing.Size(387, 135);
            this.TableAddPage.TabIndex = 10;
            // 
            // LblFolderName
            // 
            this.LblFolderName.AutoSize = true;
            this.LblFolderName.Location = new System.Drawing.Point(3, 90);
            this.LblFolderName.Name = "LblFolderName";
            this.LblFolderName.Size = new System.Drawing.Size(67, 13);
            this.LblFolderName.TabIndex = 6;
            this.LblFolderName.Text = "Folder Name";
            // 
            // LblPageName
            // 
            this.LblPageName.AutoSize = true;
            this.LblPageName.Location = new System.Drawing.Point(3, 45);
            this.LblPageName.Name = "LblPageName";
            this.LblPageName.Size = new System.Drawing.Size(63, 13);
            this.LblPageName.TabIndex = 4;
            this.LblPageName.Text = "Page Name";
            // 
            // LblUrl
            // 
            this.LblUrl.AutoSize = true;
            this.LblUrl.Location = new System.Drawing.Point(3, 0);
            this.LblUrl.Name = "LblUrl";
            this.LblUrl.Size = new System.Drawing.Size(29, 13);
            this.LblUrl.TabIndex = 1;
            this.LblUrl.Text = "URL";
            // 
            // TxtUrl
            // 
            this.TxtUrl.Location = new System.Drawing.Point(89, 3);
            this.TxtUrl.Name = "TxtUrl";
            this.TxtUrl.Size = new System.Drawing.Size(280, 20);
            this.TxtUrl.TabIndex = 3;
            // 
            // TxtPageName
            // 
            this.TxtPageName.Location = new System.Drawing.Point(89, 48);
            this.TxtPageName.Name = "TxtPageName";
            this.TxtPageName.Size = new System.Drawing.Size(154, 20);
            this.TxtPageName.TabIndex = 5;
            // 
            // TxtFolderName
            // 
            this.TxtFolderName.Location = new System.Drawing.Point(89, 93);
            this.TxtFolderName.Name = "TxtFolderName";
            this.TxtFolderName.Size = new System.Drawing.Size(154, 20);
            this.TxtFolderName.TabIndex = 7;
            // 
            // TableAddWebpart
            // 
            this.TableAddWebpart.ColumnCount = 2;
            this.TableAddWebpart.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 32.17391F));
            this.TableAddWebpart.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 67.82609F));
            this.TableAddWebpart.Controls.Add(this.LblChooseZone, 0, 2);
            this.TableAddWebpart.Controls.Add(this.LblChooseWebpart, 0, 1);
            this.TableAddWebpart.Controls.Add(this.LblWebpartPage, 0, 0);
            this.TableAddWebpart.Controls.Add(this.TxtWebpartPage, 1, 0);
            this.TableAddWebpart.Controls.Add(this.DrpdChooseWebpart, 1, 1);
            this.TableAddWebpart.Controls.Add(this.DrpdChooseZone, 1, 2);
            this.TableAddWebpart.Location = new System.Drawing.Point(94, 17);
            this.TableAddWebpart.Name = "TableAddWebpart";
            this.TableAddWebpart.RowCount = 3;
            this.TableAddWebpart.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddWebpart.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddWebpart.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 57F));
            this.TableAddWebpart.Size = new System.Drawing.Size(460, 142);
            this.TableAddWebpart.TabIndex = 11;
            // 
            // LblChooseZone
            // 
            this.LblChooseZone.AutoSize = true;
            this.LblChooseZone.Location = new System.Drawing.Point(3, 84);
            this.LblChooseZone.Name = "LblChooseZone";
            this.LblChooseZone.Size = new System.Drawing.Size(71, 13);
            this.LblChooseZone.TabIndex = 4;
            this.LblChooseZone.Text = "Choose Zone";
            // 
            // LblChooseWebpart
            // 
            this.LblChooseWebpart.AutoSize = true;
            this.LblChooseWebpart.Location = new System.Drawing.Point(3, 42);
            this.LblChooseWebpart.Name = "LblChooseWebpart";
            this.LblChooseWebpart.Size = new System.Drawing.Size(87, 13);
            this.LblChooseWebpart.TabIndex = 2;
            this.LblChooseWebpart.Text = "Choose Webpart";
            // 
            // LblWebpartPage
            // 
            this.LblWebpartPage.AutoSize = true;
            this.LblWebpartPage.Location = new System.Drawing.Point(3, 0);
            this.LblWebpartPage.Name = "LblWebpartPage";
            this.LblWebpartPage.Size = new System.Drawing.Size(109, 13);
            this.LblWebpartPage.TabIndex = 0;
            this.LblWebpartPage.Text = "Add Webpart to page";
            // 
            // TxtWebpartPage
            // 
            this.TxtWebpartPage.Location = new System.Drawing.Point(150, 3);
            this.TxtWebpartPage.Name = "TxtWebpartPage";
            this.TxtWebpartPage.Size = new System.Drawing.Size(285, 20);
            this.TxtWebpartPage.TabIndex = 1;
            // 
            // DrpdChooseWebpart
            // 
            this.DrpdChooseWebpart.FormattingEnabled = true;
            this.DrpdChooseWebpart.Location = new System.Drawing.Point(150, 45);
            this.DrpdChooseWebpart.Name = "DrpdChooseWebpart";
            this.DrpdChooseWebpart.Size = new System.Drawing.Size(285, 21);
            this.DrpdChooseWebpart.TabIndex = 3;
            // 
            // DrpdChooseZone
            // 
            this.DrpdChooseZone.FormattingEnabled = true;
            this.DrpdChooseZone.Location = new System.Drawing.Point(150, 87);
            this.DrpdChooseZone.Name = "DrpdChooseZone";
            this.DrpdChooseZone.Size = new System.Drawing.Size(285, 21);
            this.DrpdChooseZone.TabIndex = 5;
            // 
            // CreateNewPage
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(617, 583);
            this.Controls.Add(this.TableAddWebpart);
            this.Controls.Add(this.TableAddPage);
            this.Controls.Add(this.LabelStatus);
            this.Controls.Add(this.LblStatus);
            this.Controls.Add(this.progressBar);
            this.Controls.Add(this.BtnSubmit);
            this.Name = "CreateNewPage";
            this.Text = "CreateNewPage";
            this.Load += new System.EventHandler(this.CreateNewPage_Load);
            this.TableAddPage.ResumeLayout(false);
            this.TableAddPage.PerformLayout();
            this.TableAddWebpart.ResumeLayout(false);
            this.TableAddWebpart.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button BtnSubmit;
        private System.Windows.Forms.ProgressBar progressBar;
        private System.Windows.Forms.Label LblStatus;
        private System.Windows.Forms.Label LabelStatus;
        private System.Windows.Forms.TableLayoutPanel TableAddPage;
        private System.Windows.Forms.Label LblFolderName;
        private System.Windows.Forms.Label LblPageName;
        private System.Windows.Forms.Label LblUrl;
        private System.Windows.Forms.TextBox TxtUrl;
        private System.Windows.Forms.TextBox TxtPageName;
        private System.Windows.Forms.TextBox TxtFolderName;
        private System.Windows.Forms.TableLayoutPanel TableAddWebpart;
        private System.Windows.Forms.Label LblChooseZone;
        private System.Windows.Forms.Label LblChooseWebpart;
        private System.Windows.Forms.Label LblWebpartPage;
        private System.Windows.Forms.TextBox TxtWebpartPage;
        private System.Windows.Forms.ComboBox DrpdChooseWebpart;
        private System.Windows.Forms.ComboBox DrpdChooseZone;
    }
}