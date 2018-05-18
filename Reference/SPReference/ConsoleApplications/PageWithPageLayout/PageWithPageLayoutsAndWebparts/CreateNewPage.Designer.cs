namespace PageWithPageLayoutsAndWebparts
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CreateNewPage));
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
            this.DrpdChooseWebpart = new System.Windows.Forms.ComboBox();
            this.DrpdChooseZone = new System.Windows.Forms.ComboBox();
            this.LblWebpartPage = new System.Windows.Forms.Label();
            this.LblChooseWebpart = new System.Windows.Forms.Label();
            this.TxtWebpartPage = new System.Windows.Forms.TextBox();
            this.BtnAddWebPart = new System.Windows.Forms.Button();
            this.LblHeading = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.BtnSubmit = new System.Windows.Forms.Button();
            this.progressBar = new PageWithPageLayoutsAndWebparts.NewProgressBar();
            this.TableAddPage.SuspendLayout();
            this.TableAddWebpart.SuspendLayout();
            this.SuspendLayout();
            // 
            // LblStatus
            // 
            this.LblStatus.AutoSize = true;
            this.LblStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblStatus.ForeColor = System.Drawing.Color.Green;
            this.LblStatus.Location = new System.Drawing.Point(204, 365);
            this.LblStatus.Name = "LblStatus";
            this.LblStatus.Size = new System.Drawing.Size(74, 13);
            this.LblStatus.TabIndex = 8;
            this.LblStatus.Text = "StatusLabel";
            this.LblStatus.Click += new System.EventHandler(this.LblStatus_Click);
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
            this.TableAddPage.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 23.67942F));
            this.TableAddPage.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 76.32058F));
            this.TableAddPage.Controls.Add(this.LblFolderName, 0, 2);
            this.TableAddPage.Controls.Add(this.LblPageName, 0, 1);
            this.TableAddPage.Controls.Add(this.LblUrl, 0, 0);
            this.TableAddPage.Controls.Add(this.TxtFolderName, 1, 2);
            this.TableAddPage.Controls.Add(this.TxtUrl, 1, 0);
            this.TableAddPage.Controls.Add(this.TxtPageName, 1, 1);
            this.TableAddPage.Location = new System.Drawing.Point(100, 78);
            this.TableAddPage.Name = "TableAddPage";
            this.TableAddPage.RowCount = 3;
            this.TableAddPage.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddPage.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddPage.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 45F));
            this.TableAddPage.Size = new System.Drawing.Size(549, 135);
            this.TableAddPage.TabIndex = 10;
            // 
            // LblFolderName
            // 
            this.LblFolderName.AutoSize = true;
            this.LblFolderName.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblFolderName.Location = new System.Drawing.Point(3, 90);
            this.LblFolderName.Name = "LblFolderName";
            this.LblFolderName.Size = new System.Drawing.Size(78, 13);
            this.LblFolderName.TabIndex = 6;
            this.LblFolderName.Text = "Folder Name";
            // 
            // LblPageName
            // 
            this.LblPageName.AutoSize = true;
            this.LblPageName.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblPageName.Location = new System.Drawing.Point(3, 45);
            this.LblPageName.Name = "LblPageName";
            this.LblPageName.Size = new System.Drawing.Size(72, 13);
            this.LblPageName.TabIndex = 4;
            this.LblPageName.Text = "Page Name";
            // 
            // LblUrl
            // 
            this.LblUrl.AutoSize = true;
            this.LblUrl.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblUrl.Location = new System.Drawing.Point(3, 0);
            this.LblUrl.Name = "LblUrl";
            this.LblUrl.Size = new System.Drawing.Size(32, 13);
            this.LblUrl.TabIndex = 1;
            this.LblUrl.Text = "URL";
            // 
            // TxtUrl
            // 
            this.TxtUrl.Location = new System.Drawing.Point(132, 3);
            this.TxtUrl.Name = "TxtUrl";
            this.TxtUrl.Size = new System.Drawing.Size(371, 20);
            this.TxtUrl.TabIndex = 3;
            // 
            // TxtPageName
            // 
            this.TxtPageName.Location = new System.Drawing.Point(132, 48);
            this.TxtPageName.Name = "TxtPageName";
            this.TxtPageName.Size = new System.Drawing.Size(371, 20);
            this.TxtPageName.TabIndex = 5;
            // 
            // TxtFolderName
            // 
            this.TxtFolderName.Location = new System.Drawing.Point(132, 93);
            this.TxtFolderName.Name = "TxtFolderName";
            this.TxtFolderName.Size = new System.Drawing.Size(371, 20);
            this.TxtFolderName.TabIndex = 7;
            // 
            // TableAddWebpart
            // 
            this.TableAddWebpart.ColumnCount = 2;
            this.TableAddWebpart.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 23.73188F));
            this.TableAddWebpart.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 76.26811F));
            this.TableAddWebpart.Controls.Add(this.LblChooseZone, 0, 2);
            this.TableAddWebpart.Controls.Add(this.DrpdChooseWebpart, 1, 1);
            this.TableAddWebpart.Controls.Add(this.DrpdChooseZone, 1, 2);
            this.TableAddWebpart.Controls.Add(this.LblWebpartPage, 0, 0);
            this.TableAddWebpart.Controls.Add(this.LblChooseWebpart, 0, 1);
            this.TableAddWebpart.Controls.Add(this.TxtWebpartPage, 1, 0);
            this.TableAddWebpart.Location = new System.Drawing.Point(100, 78);
            this.TableAddWebpart.Name = "TableAddWebpart";
            this.TableAddWebpart.RowCount = 3;
            this.TableAddWebpart.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddWebpart.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.TableAddWebpart.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 57F));
            this.TableAddWebpart.Size = new System.Drawing.Size(552, 142);
            this.TableAddWebpart.TabIndex = 11;
            // 
            // LblChooseZone
            // 
            this.LblChooseZone.AutoSize = true;
            this.LblChooseZone.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblChooseZone.Location = new System.Drawing.Point(3, 84);
            this.LblChooseZone.Name = "LblChooseZone";
            this.LblChooseZone.Size = new System.Drawing.Size(82, 13);
            this.LblChooseZone.TabIndex = 4;
            this.LblChooseZone.Text = "Choose Zone";
            // 
            // DrpdChooseWebpart
            // 
            this.DrpdChooseWebpart.FormattingEnabled = true;
            this.DrpdChooseWebpart.Location = new System.Drawing.Point(133, 45);
            this.DrpdChooseWebpart.Name = "DrpdChooseWebpart";
            this.DrpdChooseWebpart.Size = new System.Drawing.Size(373, 21);
            this.DrpdChooseWebpart.TabIndex = 3;
            // 
            // DrpdChooseZone
            // 
            this.DrpdChooseZone.FormattingEnabled = true;
            this.DrpdChooseZone.Location = new System.Drawing.Point(133, 87);
            this.DrpdChooseZone.Name = "DrpdChooseZone";
            this.DrpdChooseZone.Size = new System.Drawing.Size(373, 21);
            this.DrpdChooseZone.TabIndex = 5;
            // 
            // LblWebpartPage
            // 
            this.LblWebpartPage.AutoSize = true;
            this.LblWebpartPage.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblWebpartPage.Location = new System.Drawing.Point(3, 0);
            this.LblWebpartPage.Name = "LblWebpartPage";
            this.LblWebpartPage.Size = new System.Drawing.Size(72, 13);
            this.LblWebpartPage.TabIndex = 0;
            this.LblWebpartPage.Text = "Page Name";
            // 
            // LblChooseWebpart
            // 
            this.LblChooseWebpart.AutoSize = true;
            this.LblChooseWebpart.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblChooseWebpart.Location = new System.Drawing.Point(3, 42);
            this.LblChooseWebpart.Name = "LblChooseWebpart";
            this.LblChooseWebpart.Size = new System.Drawing.Size(101, 13);
            this.LblChooseWebpart.TabIndex = 2;
            this.LblChooseWebpart.Text = "Choose Webpart";
            this.LblChooseWebpart.Click += new System.EventHandler(this.LblChooseWebpart_Click);
            // 
            // TxtWebpartPage
            // 
            this.TxtWebpartPage.Location = new System.Drawing.Point(133, 3);
            this.TxtWebpartPage.Name = "TxtWebpartPage";
            this.TxtWebpartPage.Size = new System.Drawing.Size(373, 20);
            this.TxtWebpartPage.TabIndex = 1;
            this.TxtWebpartPage.TextChanged += new System.EventHandler(this.TxtWebpartPage_TextChanged);
            // 
            // BtnAddWebPart
            // 
            this.BtnAddWebPart.BackColor = System.Drawing.SystemColors.InactiveCaption;
            this.BtnAddWebPart.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnAddWebPart.ForeColor = System.Drawing.SystemColors.ControlText;
            this.BtnAddWebPart.Location = new System.Drawing.Point(288, 258);
            this.BtnAddWebPart.Name = "BtnAddWebPart";
            this.BtnAddWebPart.Size = new System.Drawing.Size(181, 33);
            this.BtnAddWebPart.TabIndex = 12;
            this.BtnAddWebPart.Text = "Click this to add webpart to a page";
            this.BtnAddWebPart.UseVisualStyleBackColor = false;
            this.BtnAddWebPart.Click += new System.EventHandler(this.BtnAddWebPart_Click);
            // 
            // LblHeading
            // 
            this.LblHeading.AutoSize = true;
            this.LblHeading.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblHeading.ForeColor = System.Drawing.Color.Blue;
            this.LblHeading.Location = new System.Drawing.Point(91, 34);
            this.LblHeading.Name = "LblHeading";
            this.LblHeading.Size = new System.Drawing.Size(81, 13);
            this.LblHeading.TabIndex = 13;
            this.LblHeading.Text = "Add Webpart";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.Color.Green;
            this.label2.Location = new System.Drawing.Point(91, 365);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(107, 13);
            this.label2.TabIndex = 14;
            this.label2.Text = "Provision Status :";
            // 
            // BtnSubmit
            // 
            this.BtnSubmit.BackColor = System.Drawing.SystemColors.InactiveCaption;
            this.BtnSubmit.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnSubmit.ForeColor = System.Drawing.SystemColors.ControlText;
            this.BtnSubmit.Location = new System.Drawing.Point(288, 258);
            this.BtnSubmit.Name = "BtnSubmit";
            this.BtnSubmit.Size = new System.Drawing.Size(181, 33);
            this.BtnSubmit.TabIndex = 15;
            this.BtnSubmit.Text = "Click this to create a page";
            this.BtnSubmit.UseVisualStyleBackColor = false;
            this.BtnSubmit.Click += new System.EventHandler(this.BtnSubmit_Click);
            // 
            // progressBar
            // 
            this.progressBar.Enabled = false;
            this.progressBar.Location = new System.Drawing.Point(94, 317);
            this.progressBar.Name = "progressBar";
            this.progressBar.Size = new System.Drawing.Size(562, 23);
            this.progressBar.TabIndex = 7;
            this.progressBar.Visible = false;
            this.progressBar.Click += new System.EventHandler(this.progressBar_Click);
            // 
            // CreateNewPage
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Gainsboro;
            this.ClientSize = new System.Drawing.Size(741, 403);
            this.Controls.Add(this.BtnSubmit);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.LblHeading);
            this.Controls.Add(this.BtnAddWebPart);
            this.Controls.Add(this.TableAddWebpart);
            this.Controls.Add(this.TableAddPage);
            this.Controls.Add(this.LabelStatus);
            this.Controls.Add(this.LblStatus);
            this.Controls.Add(this.progressBar);
            this.ForeColor = System.Drawing.SystemColors.ControlText;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "CreateNewPage";
            this.Text = "Create SharePoint Page and Add Webparts";
            this.Load += new System.EventHandler(this.CreateNewPage_Load);
            this.TableAddPage.ResumeLayout(false);
            this.TableAddPage.PerformLayout();
            this.TableAddWebpart.ResumeLayout(false);
            this.TableAddWebpart.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
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
        private System.Windows.Forms.Button BtnAddWebPart;
        private System.Windows.Forms.Label LblHeading;
        private System.Windows.Forms.Label label2;
        private NewProgressBar progressBar;
        private System.Windows.Forms.Button BtnSubmit;
    }
}