namespace PageWithPageLayout
{
    partial class CreatePage
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
            this.LblUrl = new System.Windows.Forms.Label();
            this.LblPageName = new System.Windows.Forms.Label();
            this.TxtUrl = new System.Windows.Forms.TextBox();
            this.TxtPageName = new System.Windows.Forms.TextBox();
            this.BtnSubmit = new System.Windows.Forms.Button();
            this.LblFolderName = new System.Windows.Forms.Label();
            this.TxtFolderName = new System.Windows.Forms.TextBox();
            this.progressBar = new System.Windows.Forms.ProgressBar();
            this.LblStatus = new System.Windows.Forms.Label();
            this.LabelStatus = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // LblUrl
            // 
            this.LblUrl.AutoSize = true;
            this.LblUrl.Location = new System.Drawing.Point(91, 51);
            this.LblUrl.Name = "LblUrl";
            this.LblUrl.Size = new System.Drawing.Size(29, 13);
            this.LblUrl.TabIndex = 0;
            this.LblUrl.Text = "URL";
            // 
            // LblPageName
            // 
            this.LblPageName.AutoSize = true;
            this.LblPageName.Location = new System.Drawing.Point(91, 97);
            this.LblPageName.Name = "LblPageName";
            this.LblPageName.Size = new System.Drawing.Size(63, 13);
            this.LblPageName.TabIndex = 1;
            this.LblPageName.Text = "Page Name";
            // 
            // TxtUrl
            // 
            this.TxtUrl.Location = new System.Drawing.Point(201, 48);
            this.TxtUrl.Name = "TxtUrl";
            this.TxtUrl.Size = new System.Drawing.Size(280, 20);
            this.TxtUrl.TabIndex = 2;
            // 
            // TxtPageName
            // 
            this.TxtPageName.Location = new System.Drawing.Point(201, 94);
            this.TxtPageName.Name = "TxtPageName";
            this.TxtPageName.Size = new System.Drawing.Size(154, 20);
            this.TxtPageName.TabIndex = 3;
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
            // LblFolderName
            // 
            this.LblFolderName.AutoSize = true;
            this.LblFolderName.Location = new System.Drawing.Point(91, 141);
            this.LblFolderName.Name = "LblFolderName";
            this.LblFolderName.Size = new System.Drawing.Size(67, 13);
            this.LblFolderName.TabIndex = 5;
            this.LblFolderName.Text = "Folder Name";
            // 
            // TxtFolderName
            // 
            this.TxtFolderName.Location = new System.Drawing.Point(201, 138);
            this.TxtFolderName.Name = "TxtFolderName";
            this.TxtFolderName.Size = new System.Drawing.Size(154, 20);
            this.TxtFolderName.TabIndex = 6;
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
            // CreatePage
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(617, 328);
            this.Controls.Add(this.LabelStatus);
            this.Controls.Add(this.LblStatus);
            this.Controls.Add(this.progressBar);
            this.Controls.Add(this.TxtFolderName);
            this.Controls.Add(this.LblFolderName);
            this.Controls.Add(this.BtnSubmit);
            this.Controls.Add(this.TxtPageName);
            this.Controls.Add(this.TxtUrl);
            this.Controls.Add(this.LblPageName);
            this.Controls.Add(this.LblUrl);
            this.Name = "CreatePage";
            this.Text = "CreatePage";
            this.Load += new System.EventHandler(this.CreatePage_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label LblUrl;
        private System.Windows.Forms.Label LblPageName;
        private System.Windows.Forms.TextBox TxtUrl;
        private System.Windows.Forms.TextBox TxtPageName;
        private System.Windows.Forms.Button BtnSubmit;
        private System.Windows.Forms.Label LblFolderName;
        private System.Windows.Forms.TextBox TxtFolderName;
        private System.Windows.Forms.ProgressBar progressBar;
        private System.Windows.Forms.Label LblStatus;
        private System.Windows.Forms.Label LabelStatus;
    }
}