import { notification } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

notification.config({
    placement: "top",
    duration: 2.5,
});
const MySwal = withReactContent(Swal);

export function openNotificationWithIcon(
    type,
    message,
    description,
    className
) {
    notification[type]({
        message: message,
        description: description,
        className: className,
        style: {
            whiteSpace: "pre-wrap",
        },
    });
}

export function openNotificationSweetAlert(icon, message, color, status, className, button) {
    MySwal.fire({
        // timer: 1000000000,
        title: <span className={className} style={{ color: color }}>{status}</span>,
        html: <i style={{ fontSize: 16 }}>{message}</i>,
        // icon: "success",
        imageUrl: icon,
        showConfirmButton: button !== undefined ? true : false,
        confirmButtonText: button,
        // confirmButtonColor: "#fff",
        focusConfirm: true,
        // allowOutsideClick: false,
        customClass: {
            icon: "my-custom-icon-class", // Thêm class tùy chỉnh cho biểu tượng
            popup: "custom-notification",
            // confirmButton: "custom-confirm-btn"
            // image: "custom-image"
        },
        position: "top",
        // width: screenWindown768px === true ? "80%" : "20%",
    });

}
// export function openNotificationUpload() {
//     Swal.fire({
//       title: <span>Đang upload toàn bộ ảnh</span>,
//     }).then(async (result) => {
//       try {
//         // Make your API call for uploading here
//         const response = await yourApiCall();
  
//         if (response.status === 200) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Thành công!',
//             text: 'Dữ liệu đã được gửi thành công.',
//           });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Lỗi!',
//             text: 'Có lỗi xảy ra khi gửi dữ liệu.',
//           });
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Lỗi!',
//           text: 'Có lỗi xảy ra khi gửi dữ liệu.',
//         });
//       }
//     });
//   }