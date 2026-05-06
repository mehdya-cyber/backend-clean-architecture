export const BULK_UPLOAD_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type BulkUploadStatus =
  (typeof BULK_UPLOAD_STATUS)[keyof typeof BULK_UPLOAD_STATUS];

export interface IBulkUpload {
  id: string;
  userId: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
  errorInfo: string | null;
  status: BulkUploadStatus;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
  // markProcessing(): void;
  // markCompleted(processedRows: number, failedRows: number): void;
  // markFailed(errorMessage: string): void;
}

export class BulkUploadEntity implements IBulkUpload {
  id: string;
  userId: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
  errorInfo: string | null;
  status: BulkUploadStatus;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IBulkUpload) {
    this.id = data.id;
    this.userId = data.userId;
    this.totalRows = data.totalRows;
    this.processedRows = data.processedRows;
    this.failedRows = data.failedRows;
    this.errorInfo = data.errorInfo;
    this.status = data.status;
    this.fileName = data.fileName;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  markProcessing = () => {
    if (this.status !== BULK_UPLOAD_STATUS.PENDING) {
      throw new Error("Bulk upload is not in pending state");
    }
    this.status = BULK_UPLOAD_STATUS.PROCESSING;
    this.updatedAt = new Date();
  };

  markCompleted = (processedRows: number, failedRows: number) => {
    this.processedRows = processedRows;
    this.failedRows = failedRows;
    this.status = BULK_UPLOAD_STATUS.COMPLETED;
    this.updatedAt = new Date();
  };

  markFailed = (errorMessage: string) => {
    this.errorInfo = errorMessage;
    this.status = BULK_UPLOAD_STATUS.FAILED;
    this.updatedAt = new Date();
  };
}
