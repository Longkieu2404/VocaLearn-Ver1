---

## Bước 6 – Bật Firebase Storage (cho tính năng ảnh bìa bộ thẻ)

1. Firebase Console → **Storage** → **Get started**
2. Chọn **"Start in production mode"** → chọn region (nên cùng region với Firestore)
3. Sau khi tạo xong, vào tab **Rules**
4. Xóa nội dung cũ, dán nội dung từ file `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /thumbs/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Nhấn **Publish**

> Ảnh thumbnail sẽ được lưu tại đường dẫn: `thumbs/{userId}/{setId}.jpg`  
> Dung lượng free tier: 5GB, đủ cho hàng nghìn ảnh bìa.

---

## Tính năng ảnh bìa bộ thẻ

- **Icon mặc định**: Mỗi bộ thẻ tự động nhận icon SVG theo chủ đề tên (trường học, động vật, thể thao...) — không cần AI, không cần mạng.
- **Tải ảnh lên**: Nhấn nút 📷 trên card hoặc trong modal tạo/sửa bộ thẻ để tải ảnh tùy chỉnh.
- **Đồng bộ**: Ảnh được upload lên Firebase Storage → đồng bộ qua `thumbUrl` giữa các thiết bị.
- **Offline**: Ảnh base64 vẫn được lưu localStorage để xem được khi không có mạng.