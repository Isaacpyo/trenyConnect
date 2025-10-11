import { storage } from "./firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadFilesAndGetUrls(files: File[], basePath: string) {
  const urls: string[] = [];
  for (const file of files) {
    const path = `${basePath}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    urls.push(url);
  }
  return urls;
}
