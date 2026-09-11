using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using windown.Common.Controls;
using windown.Features.Auth.Views;
using windown.Features.Pos.Views;
using windown.Features.Warehouses.Views;

namespace windown
{
    public sealed partial class MainWindow : Window
    {
        public static new MainWindow Current { get; private set; } = null!;
        public Frame MainFrame => ContentFrame;
        public TitleBarControl TitleBar => AppTitleBar;

        public MainWindow()
        {
            Current = this;
            InitializeComponent();

            // Giao toàn bộ việc cấu hình TitleBar và 3 nút hệ thống cho chính TitleBarControl tự xử lý
            AppTitleBar.AttachToWindow(this);

            // Khởi động app: Chạy trang Auth (LoginPage) đầu tiên, ẩn Sidebar Menu
            SetLoggedIn(false);
        }

        public void ToggleNavPane()
        {
            NavView.IsPaneOpen = !NavView.IsPaneOpen;
        }

        public void SetLoggedIn(bool isLoggedIn)
        {
            if (isLoggedIn)
            {
                // Khi đăng nhập thành công: hiện Menu Sidebar, hiện nút Hamburger trên TitleBar
                NavView.IsPaneVisible = true;
                AppTitleBar.SetNavToggleVisible(true);

                // Tự động chọn mục đầu tiên (Bán Hàng POS) và nạp trang POS
                if (NavView.MenuItems.Count > 0)
                {
                    NavView.SelectedItem = NavView.MenuItems[0];
                }
                ContentFrame.Navigate(typeof(PosPage));
            }
            else
            {
                // Khi chưa đăng nhập hoặc đăng xuất: ẩn hoàn toàn Menu Sidebar và nút Hamburger
                NavView.IsPaneVisible = false;
                AppTitleBar.SetNavToggleVisible(false);

                // Nạp trang LoginPage
                ContentFrame.Navigate(typeof(LoginPage));
            }
        }

        private void NavView_ItemInvoked(NavigationView sender, NavigationViewItemInvokedEventArgs args)
        {
            // Xử lý nút Đăng Xuất ở chân Menu
            if (args.InvokedItemContainer?.Tag?.ToString() == "Logout")
            {
                SetLoggedIn(false);
                return;
            }
        }

        private void NavView_SelectionChanged(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
        {
            if (args.IsSettingsSelected)
            {
                // Khi bấm nút Cài đặt
                return;
            }

            if (args.SelectedItemContainer is NavigationViewItem item)
            {
                string tag = item.Tag?.ToString() ?? "";
                switch (tag)
                {
                    case "Pos":
                        ContentFrame.Navigate(typeof(PosPage));
                        break;
                    case "Warehouse":
                        ContentFrame.Navigate(typeof(WarehousePage));
                        break;
                }
            }
        }
    }
}
