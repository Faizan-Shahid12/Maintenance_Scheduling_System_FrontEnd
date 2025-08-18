import api from "../../settings/axios";


export const GetAllAttachment_api = (logid : number) =>
{
    return api.get("/TaskLogAttachment/GetAllAttachments?logId=" + logid);
}

export const DeleteAttachment_api = (attachid: number) =>
{
    return api.delete("/TaskLogAttachment/DeleteAttachment?attachid=" + attachid);
}

export const DownloadAttachment_api = (attachid: number) =>
{
   return api.get("/TaskLogAttachment/DownloadAttachment?attachId=" + attachid);
}

export const UploadAttachment_api = (formData: FormData) =>
{
    return api.post("/TaskLogAttachment/UploadAttachment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
}