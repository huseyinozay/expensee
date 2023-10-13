import { useUserState } from "@/context/user";
import { imageRawBaseUrl } from "@/utils/utils";
import React from "react";

interface BlobImageProps {
  file: string;
  isThumbnail?: boolean;
}

export function BlobImage({ file, isThumbnail = false }: BlobImageProps) {
  const { companyId, sasToken } = useUserState();
  const containerName = `prod-${companyId}`;

  return (
    <a
      href={`${imageRawBaseUrl}${containerName}/${file}${sasToken}`}
      target="_blank"
      key={file}
      style={
        isThumbnail
          ? { width: "24px", height: "24px", borderRadius: "4px" }
          : { width: "100px", height: "100px", borderRadius: "50%" }
      }
    >
      <img
        src={`${imageRawBaseUrl}${containerName}/${file}${sasToken}`}
        alt=""
        style={
          isThumbnail
            ? { width: "24px", height: "24px", borderRadius: "4px" }
            : { width: "100px", height: "100px", borderRadius: "50%" }
        }
      />
    </a>
  );
}
