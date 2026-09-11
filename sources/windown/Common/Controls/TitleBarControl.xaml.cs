using System;
using System.Runtime.InteropServices;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;

namespace windown.Common.Controls
{
    public sealed partial class TitleBarControl : UserControl
    {
        [DllImport("user32.dll")]
        private static extern bool ReleaseCapture();

        [DllImport("user32.dll")]
        private static extern IntPtr SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam);

        private Window? _parentWindow;

        public static readonly DependencyProperty TitleProperty =
            DependencyProperty.Register(
                nameof(Title),
                typeof(string),
                typeof(TitleBarControl),
                new PropertyMetadata("Gold Business Client 2026", OnTitleChanged));

        public static readonly DependencyProperty BranchNameProperty =
            DependencyProperty.Register(
                nameof(BranchName),
                typeof(string),
                typeof(TitleBarControl),
                new PropertyMetadata("Chi nhánh Trung tâm", OnBranchNameChanged));

        public string Title
        {
            get => (string)GetValue(TitleProperty);
            set => SetValue(TitleProperty, value);
        }

        public string BranchName
        {
            get => (string)GetValue(BranchNameProperty);
            set => SetValue(BranchNameProperty, value);
        }

        public TitleBarControl()
        {
            InitializeComponent();
        }

        public void AttachToWindow(Window window)
        {
            _parentWindow = window;

            // Tắt hoàn toàn 3 nút mặc định của hệ điều hành Windows để dùng 3 nút XAML tự vẽ
            if (window.AppWindow.Presenter is OverlappedPresenter presenter)
            {
                presenter.SetBorderAndTitleBar(hasBorder: true, hasTitleBar: false);
            }

            // Lắng nghe trạng thái cửa sổ để tự động đổi icon Phóng to (1 ô) <-> Thu hồi (2 ô)
            window.AppWindow.Changed += (s, e) =>
            {
                if (e.DidPresenterChange || e.DidSizeChange)
                {
                    if (window.AppWindow.Presenter is OverlappedPresenter p)
                    {
                        MaximizeIcon.Glyph = p.State == OverlappedPresenterState.Maximized ? "\uE923" : "\uE922";
                        ToolTipService.SetToolTip(MaximizeBtn, p.State == OverlappedPresenterState.Maximized ? "Khôi phục kích thước" : "Phóng to");
                    }
                }
            };
        }

        public void SetNavToggleVisible(bool visible)
        {
            NavToggleBtn.Visibility = visible ? Visibility.Visible : Visibility.Collapsed;
        }

        private void NavToggleBtn_Click(object sender, RoutedEventArgs e)
        {
            MainWindow.Current.ToggleNavPane();
        }

        #region Xử lý Kéo thả và Click đúp trên TitleBar

        private void DragArea_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            if (_parentWindow == null) return;
            var point = e.GetCurrentPoint(this);
            if (point.Properties.IsLeftButtonPressed)
            {
                ReleaseCapture();
                var hwnd = WinRT.Interop.WindowNative.GetWindowHandle(_parentWindow);
                SendMessage(hwnd, 0x0112, (IntPtr)0xF012, IntPtr.Zero); // WM_SYSCOMMAND, SC_MOVE + HTCAPTION
            }
        }

        private void DragArea_DoubleTapped(object sender, DoubleTappedRoutedEventArgs e)
        {
            ToggleMaximize();
        }

        #endregion

        #region Xử lý sự kiện 3 Nút Hệ Thống (C# Code-behind)

        private void MinimizeBtn_Click(object sender, RoutedEventArgs e)
        {
            if (_parentWindow?.AppWindow.Presenter is OverlappedPresenter presenter)
            {
                presenter.Minimize();
            }
        }

        private void MaximizeBtn_Click(object sender, RoutedEventArgs e)
        {
            ToggleMaximize();
        }

        private void ToggleMaximize()
        {
            if (_parentWindow?.AppWindow.Presenter is OverlappedPresenter presenter)
            {
                if (presenter.State == OverlappedPresenterState.Maximized)
                {
                    presenter.Restore();
                }
                else
                {
                    presenter.Maximize();
                }
            }
        }

        private void CloseBtn_Click(object sender, RoutedEventArgs e)
        {
            _parentWindow?.Close();
        }

        #endregion

        private static void OnTitleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is TitleBarControl control && e.NewValue is string newTitle)
            {
                control.TitleText.Text = newTitle;
            }
        }

        private static void OnBranchNameChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is TitleBarControl control && e.NewValue is string newBranch)
            {
                control.BranchText.Text = newBranch;
            }
        }
    }
}
