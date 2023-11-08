import {
  expenseStatus,
  formStatus,
  imageRawBaseUrl,
  paymentMethods,
  currencyList,
} from "./utils";

type Column = {
  field: string;
  title: string;
  formatter?: (val: any) => string;
};

export const expenseColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.expenseNo",
  },
  {
    field: "guid",
    title: "labels.receipt",
    formatter: (val) => (val ? `BLOBIMAGE_${val}` : null),
  },
  {
    field: "user",
    title: "labels.user",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  {
    field: "merchant",
    title: "labels.merchant",
  },
  {
    field: "combinedAmount",
    title: "labels.amount",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => expenseStatus[val],
  },
  {
    field: "paymentMethod",
    title: "labels.paymentType",
    //@ts-ignore
    formatter: (val) => paymentMethods[val],
  },
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "expenseDate",
    title: "labels.expenseDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "createDate",
    title: "labels.uploadDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "details",
    title: "labels.details",
  },
];

export const expenseColumnsSimplified: Array<Column> = [
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "taxPercentage",
    title: "labels.taxPercentage",
    formatter: (val) => `%${val}`,
  },
  {
    field: "combinedAmount",
    title: "labels.amount",
  },
];

export const expenseReportColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "user",
    title: "labels.expenseOwner",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "combinedAmount",
    title: "labels.amount",
  },
  {
    field: "statusText",
    title: "labels.status",
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "approver",
    title: "labels.approvingExpenseBy",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "isDelivered",
    title: "labels.deliveryStatus",
    // formatter: (val) => (val ? "labels.delivered" : "labels.notDelivered"),
  },
  {
    field: "details",
    title: "labels.details",
  },
];

export const allReadyExpenseColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "merchant",
    title: "labels.merchant",
  },
  {
    field: "amount",
    title: "labels.amount",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => expenseStatus[val],
  },
  {
    field: "paymentMethod",
    title: "labels.paymentType",
    //@ts-ignore
    formatter: (val) => paymentMethods[val],
  },
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "expenseDate",
    title: "labels.expenseDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "createDate",
    title: "labels.uploadDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
];

export const waitingApprovalReportColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "totalAmount",
    title: "labels.amount",
  },
  {
    field: "statusText",
    title: "labels.status",
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  // {
  //   field: "id",
  //   title: "İşlem Geçmişi",
  // },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "isDelivered",
    title: "labels.deliveryStatus",
  },
];

export const customFormColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "customReportType",
    title: "labels.reportType",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => formStatus[val],
  },
  {
    field: "userEmail",
    title: "labels.expenseOwner",
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "approverFullName",
    title: "labels.approvingFormBy",
  },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "details",
    title: "labels.details",
  },
];

export const advanceReportColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "userEmail",
    title: "labels.expenseOwner",
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "statusText",
    title: "labels.status",
  },
  {
    field: "approverFullName",
    title: "labels.approvingExpenseBy",
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "details",
    title: "labels.details",
  },
];

export const expensePolicyColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.expenseNo",
  },
  {
    field: "guid",
    title: "labels.receipt",
    formatter: (val) => (val ? `BLOBIMAGE_${val}` : null),
  },
  {
    field: "user",
    title: "labels.user",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  {
    field: "expenseType",
    title: "labels.limit",
    formatter: (val) =>
      `${val.expenseTypeLimit} ${
        currencyList.filter((item) => item.id === val.currency)[0].name
      }`,
  },
  {
    field: "combinedAmount",
    title: "labels.amount",
  },
  {
    field: "limitDifference",
    title: "labels.difference",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => expenseStatus[val],
  },
  {
    field: "paymentMethod",
    title: "labels.paymentType",
    //@ts-ignore
    formatter: (val) => paymentMethods[val],
  },
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "expenseDate",
    title: "labels.expenseDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "createDate",
    title: "labels.uploadDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "details",
    title: "labels.details",
  },
];


export const workflowData: Array<any> = [
  {
    startIndex: 0,
    endIndex: 1,
    branches: [
      {
        index: 0,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([333,334,335,337,338,339,345],VALUE[0])",
        },
        approvers: [
          {
            Index: 0,
            UserId: 37601,
          },
        ],
      },
      {
        id: 1,
        condition: {
          triggerType: [12],
          conditionText: "_.eq(341,VALUE[0])",
        },
        approvers: [
          {
            id: 0,
            name: 8188,
          },
        ],
      },
      {
        index: 2,
        condition: {
          triggerType: [12, 9],
          conditionText: "_.eq(342,VALUE[0])",
        },
      },
    ],
  },
  {
    startIndex: 1,
    endIndex: 2,
    branches: [
      {
        index: 0,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([333],VALUE[0])",
        },
        approvers: [
          {
            I: 0,
            name: 13465,
          },
        ],
      },
      {
        index: 1,
        condition: {
          triggerType: [12, 5],
          conditionText:
            "_.includes([334], VALUE[0]) || (_.eq(342,VALUE[0]) && _.eq(1178,VALUE[1]))",
        },
        approvers: [
          {
            I: 0,
            name: 7662,
          },
        ],
      },
      {
        index: 2,
        condition: {
          triggerType: [12, 5],
          conditionText:
            "_.includes([335],VALUE[0]) || (_.eq(342,VALUE[0]) && _.eq(1182,VALUE[1]))",
        },
        approvers: [
          {
            I: 0,
            name: 8310,
          },
        ],
      },
      {
        index: 3,
        condition: {
          triggerType: [12, 5],
          conditionText:
            "_.includes([337],VALUE[0]) || (_.eq(342,VALUE[0]) && _.eq(1686,VALUE[1]))",
        },
        approvers: [
          {
            id: 0,
            name: 8307,
          },
        ],
      },
      {
        index: 4,
        condition: {
          triggerType: [12, 5],
          conditionText:
            "_.eq(338,VALUE[0]) || (_.eq(342,VALUE[0]) && _.eq(1183,VALUE[1]))",
        },
        approvers: [
          {
            id: 0,
            name: 8309,
          },
        ],
      },
      {
        index: 5,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([339,341],VALUE[0])",
        },
        approvers: [
          {
            id: 0,
            name: 40775,
          },
        ],
      },
      {
        index: 6,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([345],VALUE[0])",
        },
        approvers: [
          {
            id: 0,
            name: 8312,
          },
        ],
      },
    ],
  },
  {
    startIndex: 2,
    endIndex: 3,
    branches: [
      {
        index: 0,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([333,334,335,337,338,339,341],VALUE[0])",
        },
        approvers: [
          {
            id: 0,
            name: 8312,
          },
        ],
      },
      {
        index: 1,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([345], VALUE[0])",
        },
      },
    ],
  },
  {
    startIndex: 3,
    endIndex: 4,
    condition: {
      triggerType: [12, 13],
      conditionText: "_.includes([342],VALUE[0])",
    },
    branches: [
      {
        index: 0,
        condition: {
          triggerType: [12],
          conditionText: "_.includes([342],VALUE[0])",
        },
        approvers: [
          {
            index: 0,
            name: 8312,
          },
        ],
      },
    ],
  },
];

export const conditionNameList: Array<any> = [
  {
    name: 'eq',
    description: 'Eşit',
  },
  {
    name: 'lte',
    description: 'Büyük Eşit',
  },
  {
    name: 'includes',
    description: 'İçerir',
  },
];

export const triggerTypeList: Array<any> = [
  {
    index: 1,
    description: 'Kullanıcı',
  },
  {
    index: 2,
    description: 'Departman',
  },
  {
    index: 3,
    description: 'Ünvan',
  },
  {
    index: 4,
    description: 'Tag',
  },
  {
    index: 5,
    description: 'Organizasyon',
  },
  {
    index: 6,
    description: 'Hepsi',
  },
  {
    index: 7,
    description: 'Kategori',
  },
  {
    index: 8,
    description: 'Toplam Tutar',
  },
  {
    index: 9,
    description: 'Linear',
  },
  {
    index: 10,
    description: 'Ek Alan',
  },
  {
    index: 11,
    description: 'Masraf',
  },
  {
    index: 12,
    description: 'Kullanıcı Grubu',
  },
  {
    index: 13,
    description: 'Son Onaycı',
  },
  {
    index: 14,
    description: 'Rapor Türü',
  },
  {
    index: 15,
    description: 'Kullanıcı Grubu',
  },
  {
    index: 16,
    description: 'Seviye sistemi',
  },
  {
    index: 17,
    description: 'Kullanıcı Seviyesi',
  },
  {
    index: 18,
    description: 'Masraf Merkezi Amiri',
  },
  {
    index: 19,
    description: 'İlk Yönetici',
  },
  {
    index: 20,
    description: 'Belirli bir Seviye',
  },
  {
    index: 21,
    description: 'Kullanıcı Seviye Değeri',
  },
  {
    index: 22,
    description: 'Seyahat Onay Akışı',
  },
  {
    index: 23,
    description: 'Seyahat Yurtdışı Kontrolü',
  },
  {
    index: 24,
    description: 'Etiketler ve Departmanlar ile Özelleşmiş Kural',
  }
];
