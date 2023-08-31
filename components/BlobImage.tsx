import { useUserState } from "@/context/user";
import { imageRawBaseUrl } from "@/utils/utils";
import React from "react";

interface BlobImageProps {
  file: string;
  isThumbnail?: boolean
}

export function BlobImage({ file, isThumbnail = false }: BlobImageProps) {
  const { companyId, sasToken } = useUserState();
  const containerName = `prod-${companyId}`;

  return (
    <a
      href={`${imageRawBaseUrl}${containerName}/${file}${sasToken}`}
      target="_blank"
      key={file}
      style={{ width: "100px", height: "100px" }}
    >
      <img
        src={`${imageRawBaseUrl}${containerName}/${file}${sasToken}`}
        alt=""
        style={ isThumbnail ? {width: "45px", height: "45px", borderRadius: '50%'} : {width: "100px", height: "100px"  }}
      />
    </a>
  );
}
