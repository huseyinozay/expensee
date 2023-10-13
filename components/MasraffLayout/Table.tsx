// import { getExpenseCategoryData, getExpenses } from "@/app/api/expense";
// import { expenseColumns } from "@/utils/data";
// import {
//   filterObjectsByIdAndName,
//   getFormattedExpenseData,
//   getIconForExpense,
// } from "@/utils/helpers";
// import {
//   MasraffColorName,
//   MasraffColorShadeName,
//   MasraffColorType,
//   MasraffFillStyle,
//   MasraffIconNames,
//   MasraffSize,
// } from "@fabrikant-masraff/masraff-core";
// import {
//   MaAvatar,
//   MaButton,
//   MaCheckbox,
//   MaContainer,
//   MaIcon,
//   MaLink,
//   MaScrollArea,
//   MaTag,
// } from "@fabrikant-masraff/masraff-react";
// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { BlobImage } from "../BlobImage";
// import { Loading } from "../Loading/Loading";

// interface ExpenseTableProps {
//   onOpenRow: (row: any) => void;
// }

// function processAndOrderDataByFieldTitlePairs(
//   data: any,
//   fieldTitlePairs: Array<{
//     field: string;
//     title: string;
//     formatter?: (val: any) => any;
//   }>
// ): any {
//   let processedDataList = [];

//   for (let dataItem of data) {
//     let processedData: any = {};

//     for (let pair of fieldTitlePairs) {
//       if (pair.field in dataItem) {
//         let value = pair.formatter
//           ? pair.formatter(dataItem[pair.field])
//           : dataItem[pair.field];

//         if (typeof value === "string" && value.startsWith("BLOBIMAGE_")) {
//           const fileId = value.replace("BLOBIMAGE_", "");

//           value = <BlobImage isThumbnail file={`${fileId}.jpg`} />;
//         }

//         processedData[pair.field] = value;
//       }
//     }

//     processedDataList.push(processedData);
//   }

//   return processedDataList;
// }

// export function TableRow(props: {
//   value: {
//     id: number;
//     guid: string | null;
//     user: string;
//     merchant: string;
//     combinedAmount: string;
//     status: string;
//     paymentMethod: string;
//     expenseTypeId: string;
//     expenseDate: string;
//     createDate: string;
//   };
//   onHover: () => void;
//   onHoverOut: () => void;
//   onOpen: (value: {
//     id: number;
//     guid: string | null;
//     user: string;
//     merchant: string;
//     combinedAmount: string;
//     status: string;
//     paymentMethod: string;
//     expenseTypeId: string;
//     expenseDate: string;
//     createDate: string;
//   }) => void;
//   isSomethingHovered: boolean;
// }) {
//   const { t } = useTranslation();
//   const [hover, setHover] = useState(false);
//   const value = props.value;
//   return (
//     <MaContainer
//       fullWidth={true}
//       style={{
//         cursor: hover ? "pointer" : "default",
//         transform: hover ? "translateX(-16px)" : undefined,
//         transition: "all 0.05s linear",
//         opacity: !props.isSomethingHovered ? 1 : hover ? 1 : 0.5,
//         textAlign: "center",
//       }}
//       maxWidth={hover ? "calc(100% + 32px)" : "100%"}
//       padding={{ left: 16, right: 24, top: 12, bottom: 12 }}
//       borderRadius={hover ? undefined : 6}
//       verticalAlignment="center"
//       elevation={hover ? "four" : "one"}
//       backgroundColor={{ color: MasraffColorName.White }}
//       horizontalGap={16}
//       distribute="edges"
//       onMaMouseOver={() => {
//         setHover(true);
//         props.onHover();
//       }}
//       onMaMouseLeave={() => {
//         setHover(false);
//         props.onHoverOut();
//       }}
//       onMaClick={() => {
//         // You will need to add an event stop propagation for any nested icon - e.g from the ... menu
//         props.onOpen(value);
//       }}
//     >
//       <MaContainer horizontalGap={16} width={"20%"} maxWidth={"20%"}>
//         <MaCheckbox />
//         <MaContainer horizontalGap={8}>
//           <MaContainer
//             padding={4}
//             borderRadius={6}
//             backgroundColor={{
//               color: MasraffColorName.Mustard,
//               shadeName: MasraffColorShadeName.Lightest,
//             }}
//           >
//             <MaIcon
//               size={16}
//               color={MasraffColorName.Mustard}
//               shadeName={MasraffColorShadeName.Darkest}
//               iconName={getIconForExpense(value.expenseTypeId)} // !!change based on type
//             />
//           </MaContainer>
//           <MaLink>{value.id}</MaLink>
//           <MaTag
//             colorType={
//               value.status === t("labels.ready")
//                 ? MasraffColorType.Constructive
//                 : MasraffColorType.Destructive
//             }
//           >
//             {value.status}
//           </MaTag>
//         </MaContainer>
//       </MaContainer>
//       {/* <MaContainer horizontalGap={8} width={"18.75%"} maxWidth={"18.75%"}>
//         <MaContainer horizontalGap={8}>
//           <MaContainer
//             padding={4}
//             borderRadius={6}
//             backgroundColor={{
//               color: MasraffColorName.Verdigris,
//               shadeName: MasraffColorShadeName.Lightest,
//             }}
//           >
//             <MaIcon
//               size={16}
//               color={MasraffColorName.Verdigris}
//               shadeName={MasraffColorShadeName.Darkest}
//               iconName={MasraffIconNames.Document}
//             />
//           </MaContainer>
//           <MaLink>{value.report}</MaLink>
//         </MaContainer>
//       </MaContainer> */}
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <MaLink>{value.guid}</MaLink>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"20%"}
//         maxWidth={"20%"}
//       >
//         <MaAvatar
//           size={MasraffSize.Small}
//           firstName={value.user.split(" ")[0]}
//           lastName={value.user.split(" ")[1]}
//           userId="1234567asdasd"
//         />
//         <MaLink>{value.user}</MaLink>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.merchant}</span>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.combinedAmount}</span>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.status}</span>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.paymentMethod}</span>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.expenseTypeId}</span>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.expenseDate}</span>
//       </MaContainer>
//       <MaContainer
//         className="ma-display-flex-justify-content-center"
//         horizontalGap={8}
//         width={"8%"}
//         maxWidth={"8%"}
//       >
//         <span>{value.createDate}</span>
//       </MaContainer>
//       <MaButton fillStyle={MasraffFillStyle.Ghost}>
//         <MaIcon slot="left-icon" iconName={MasraffIconNames.DotsHorizontal} />
//       </MaButton>
//     </MaContainer>
//   );
// }
// export function ExpenseTable({ onOpenRow }: ExpenseTableProps) {
//   const columns = expenseColumns;
//   const { t } = useTranslation();
//   const [isSomethingHovered, setIsSomethingHovered] = useState(false);
//   const filter = {
//     includes: "user, expenseType",
//     clientId: "adminApp",
//     page: 0,
//     pageSize: 10,
//     ascending: "false",
//     searchTypeId: 0,
//   };

//   const { data: expenseData, isLoading: isLoadingExpenses } =
//     useQuery<ExpenseData>({
//       queryKey: ["expenses", filter],
//       queryFn: async () => getExpenses(filter),
//     });
//   let expenses = [];
//   const { data: expenseCategoryData } = useQuery<any[]>({
//     queryKey: ["categories"],
//     queryFn: async () => getExpenseCategoryData(),
//   });
//   let expenseCategories: GenericObject[] = [];
//   if (expenseCategoryData) {
//     expenseCategories = filterObjectsByIdAndName(expenseCategoryData);
//     if (expenseData)
//       expenses = getFormattedExpenseData(
//         expenseData?.results,
//         expenseCategories
//       );
//   }

//   const orderedData: Array<object> = processAndOrderDataByFieldTitlePairs(
//     expenses,
//     columns
//   );

//   return (
//     <MaContainer
//       slot="content"
//       fullWidth={true}
//       fullHeight={true}
//       direction="column"
//       verticalAlignment="top"
//       backgroundColor={{ color: MasraffColorName.White }}
//     >
//       <MaScrollArea className="ma-display-fullwidth">
//         <MaContainer
//           verticalGap={8}
//           fullWidth={true}
//           direction="column"
//           verticalAlignment="top"
//           padding={16}
//         >
//           <MaContainer
//             padding={{ left: 16, top: 0, bottom: 16, right: 16 }}
//             fullWidth={true}
//             verticalAlignment="center"
//             horizontalGap={16}
//             distribute="edges"
//           >
//             {columns.map((column, index) => (
//               <MaContainer
//                 key={column.field}
//                 className={
//                   index !== 0 ? "ma-display-flex-justify-content-center" : ""
//                 }
//                 horizontalGap={16}
//                 width={index === 0 || index === 2 ? "20%" : "8%"}
//                 maxWidth={index === 0 || index === 2 ? "20%" : "8%"}
//               >
//                 {index === 0 && <MaCheckbox />}
//                 <h6>{t(column.title)}</h6>
//               </MaContainer>
//             ))}
//           </MaContainer>
//           {isLoadingExpenses ? (
//             <Loading />
//           ) : (
//             orderedData
//               .filter((_x, i) => i < 100)
//               .map((row: any) => {
//                 return (
//                   <TableRow
//                     onOpen={onOpenRow}
//                     isSomethingHovered={isSomethingHovered}
//                     value={row}
//                     onHover={() => setIsSomethingHovered(true)}
//                     onHoverOut={() => setIsSomethingHovered(false)}
//                   />
//                 );
//               })
//           )}
//         </MaContainer>
//       </MaScrollArea>
//     </MaContainer>
//   );
// }
