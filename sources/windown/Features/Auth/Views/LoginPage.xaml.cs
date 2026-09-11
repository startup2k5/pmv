using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace windown.Features.Auth.Views
{
    public sealed partial class LoginPage : Page
    {
        public LoginPage()
        {
            InitializeComponent();
        }

        private void LoginBtn_Click(object sender, RoutedEventArgs e)
        {
            // Cập nhật tên chi nhánh lên TitleBar
            if (BranchBox.SelectedItem is ComboBoxItem selectedBranch)
            {
                MainWindow.Current.TitleBar.BranchName = selectedBranch.Content?.ToString() ?? "Chi nhánh";
            }

            // Đăng nhập thành công -> Kích hoạt trạng thái đăng nhập (hiện Navbar Control và vào màn hình chính)
            MainWindow.Current.SetLoggedIn(true);
        }
    }
}
