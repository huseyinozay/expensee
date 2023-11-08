"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserState } from "@/context/user";
import {
  MaButton,
  MaDrawer,
  MaDrawerContent,
  MaDrawerFooter,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaIcon,
  MaList,
  MaListItem,
  MaPopover,
  MaSelect,
  MaTagInput,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import {
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
  MasraffSelectionType,
  MasraffSize,
} from "@fabrikant-masraff/masraff-core";
import { GenericObject, WorkflowApprover, WorkflowBranch } from "@/utils/types";

interface DrawerBranchProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  users?: GenericObject[];
  selectedBranch?: WorkflowBranch;
  setSelectedBranch: React.Dispatch<React.SetStateAction<WorkflowBranch>>;
}

export default function WorkflowDrawer({
  isOpen,
  changeStatus,
  selectedBranch,
  setSelectedBranch,
  users,
}: DrawerBranchProps) {
  const { t } = useTranslation();
  const [editing, setIsEditing] = useState<any | undefined>(undefined);

  const [localSelectedBranch, setLocalSelectedBranch] =
    useState<WorkflowBranch>(JSON.parse(JSON.stringify(selectedBranch)));

  const [localUsers, setLocalUsers] = useState<GenericObject[]>(
    JSON.parse(JSON.stringify(users))
  );

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // const [selectedBranch, setSelectedBranch] = useState<Branch>(JSON.parse(JSON.stringify(data)));
  // const [users,setUsers] = useState<GenericObject[]>([]);

  const inputRef = useRef<HTMLMaInputElement | HTMLMaSelectElement | null>(
    null
  );

  // API CALLS

  // const { data: expenseCategoryData } = useQuery<any[]>({
  //   queryKey: ["categories"],
  //   queryFn: async () => getExpenseCategoryData(),
  // });
  // let expenseCategories: GenericObject[] = [];
  // if (expenseCategoryData)
  //   expenseCategories = filterObjectsByIdAndName(expenseCategoryData);

  // const handleChange = (data: DropdownSelection) => {
  //   const tempBranch = { ...localSelectedBranch };
  //   // console.log(data)
  //   setLocalSelectedBranch(tempBranch);
  // };
  //
  // const [firstDropdownOptions, setFirstDropdownOptions] = useState<DropdownSelection[]>([
  //   { id: 0, name: 'Expense' },
  //   { id: 1, name: 'Report' },
  //   { id: 2, name: 'User' }
  // ]);
  // const [secondDropdownOptions, setSecondDropdownOptions] = useState<DropdownSelection[]>([]);
  // const [thirdDropdownOptions, setThirdDropdownOptions] = useState<DropdownSelection[]>([]);
  // const [fourthDropdownOptions, setFourthDropdownOptions] = useState<DropdownSelection[]>([]);
  // const [selectedSecondOption, setSelectedSecondOption] = useState<DropdownSelection | null>(null);
  //
  // const handleFirstDropdownChange = (selection: DropdownSelection) => {
  //   switch (selection.value) {
  //     case 'Expense':
  //       setSecondDropdownOptions([
  //         { id: 0, name: 'Expense Tag' },
  //         { id: 1, name: 'Expense Type' }
  //       ]);
  //       break;
  //     case 'Report':
  //       setSecondDropdownOptions([
  //         { id: 0, name: 'Report Tag' },
  //         { id: 1, name: 'Report Subcompany' },
  //         { id: 2, name: 'TotalAmount' },
  //         { id: 3, name: 'ReportType' }
  //       ]);
  //       break;
  //     case 'User':
  //       setSecondDropdownOptions([
  //         { id: 0, name: 'Id' },
  //         { id: 1, name: 'DepartmentId' },
  //         { id: 2, name: 'Title' },
  //         { id: 3, name: 'UserGroupId' }
  //       ]);
  //       break;
  //     default:
  //       setSecondDropdownOptions([]);
  //   }
  // };
  //
  // const handleSecondDropdownChange = (selection: DropdownSelection) => {
  //   debugger
  //   setSelectedSecondOption(selection); // İkinci dropdown seçimini kaydet
  //
  //   switch (selection.value) {
  //       // İkinci dropdown seçimine göre üçüncü dropdown seçeneklerini güncelle
  //     case 'TotalAmount':
  //       setThirdDropdownOptions([
  //         { id: 0, name: 'Equals (=)' },
  //         { id: 1, name: 'Not equals (not =)' },
  //         { id: 2, name: 'Less than (<)' },
  //         { id: 3, name: 'Greater than (>)' },
  //         { id: 4, name: 'Greater than or equal to (>=)' },
  //         { id: 5, name: 'Less than or equal to (<=)' }
  //       ]);
  //       break;
  //     default:
  //       setThirdDropdownOptions([
  //         { id: 0, name: 'Equals (=)' },
  //         { id: 1, name: 'Not equals (not =)' }
  //       ]);
  //   }
  // };
  //
  // const handleThirdDropdownChange = (selection: DropdownSelection) => {
  //   debugger
  //   switch (selectedSecondOption?.value) {
  //     case 'Expense Tag':
  //       const expenseTags = [
  //         { id: 0, name: '1. Etiket' },
  //         { id: 1, name: '2. Etiket' }
  //       ]
  //       setFourthDropdownOptions(expenseTags);
  //       break;
  //     case 'Expense Type':
  //       const expenseTypes = [
  //         { id: 0, name: '1. Kategori' },
  //         { id: 1, name: '2. Kategori' },
  //         { id: 2, name: '3. Kategori' }
  //       ]
  //       setFourthDropdownOptions(expenseCategories);
  //       break;
  //       // ... diğer seçenekler
  //   }
  // };

  const matchApproversWithUsers = (approvers: any[]) => {
    const matchedItems: any[] = [];

    approvers.forEach((approver) => {
      const matchedUsers = localUsers.filter((u) => u.id === approver.userId);
      matchedUsers.forEach((user) => {
        matchedItems.push(user.id);
      });
    });
    return matchedItems;
  };

  const handleItemSelect = (event: any) => {
    const newUserItem = event.detail;
    setSelectedItems((prevNumbers) => [...prevNumbers, newUserItem.value]);
  };

  function removeDuplicates(arr: number[]): number[] {
    return Array.from(new Set(arr));
  }

  const approversGenerator = (arr: number[]): WorkflowApprover[] => {
    return arr.map((userId, index) => ({
      index,
      userId,
    }));
  };

  const setApproversToBranch = () => {
    setSelectedBranch((prevState) => ({
      ...prevState,
      approvers: approversGenerator(removeDuplicates(selectedItems)),
    }));
    changeStatus(false);
  };

  useEffect(() => {
    if(localSelectedBranch.approvers){
      setSelectedItems(matchApproversWithUsers(localSelectedBranch.approvers));
    }
  }, []);

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>
          {t("labels.editBranch")}
          {/*selectedBranch.Condition*/}
        </MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid>
            <MaGridRow>
              <form>
                {/* 1. Dropdown */}
                {/*<Dropdown*/}
                {/*    input={handleFirstDropdownChange}*/}
                {/*    placeholder={'Condition'}*/}
                {/*    selectData={firstDropdownOptions}*/}
                {/*    valueName="name"*/}
                {/*    isSelectValueByName={true}*/}
                {/*/>*/}
                {/*<MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">*/}
                {/*  {t("labels.detail")}*/}
                {/*</MaText>*/}
                {/*/!* 2. Dropdown *!/*/}
                {/*<Dropdown*/}
                {/*    input={handleSecondDropdownChange} // Burada handleChange metodunu isteğine göre güncellemelisin*/}
                {/*    placeholder={'Detail'}*/}
                {/*    selectData={secondDropdownOptions}*/}
                {/*    valueName="name"*/}
                {/*    isSelectValueByName={true}*/}
                {/*/>*/}
                {/*<MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">*/}
                {/*  {t("labels.condition")}*/}
                {/*</MaText>*/}
                {/*/!* 3. Dropdown *!/*/}
                {/*<Dropdown*/}
                {/*    input={handleThirdDropdownChange}*/}
                {/*    placeholder={'Rule'}*/}
                {/*    selectData={thirdDropdownOptions}*/}
                {/*    valueName="name"*/}
                {/*/>*/}
                {/*<MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">*/}
                {/*  {t("labels.options")}*/}
                {/*</MaText>*/}
                {/*/!* 4. Dropdown *!/*/}
                {/*<Dropdown*/}
                {/*    input={handleChange}*/}
                {/*    placeholder={'Detail'}*/}
                {/*    selectData={fourthDropdownOptions}*/}
                {/*    valueName="name"*/}
                {/*/>*/}
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.approver")}
                </MaText>
                {localSelectedBranch.approvers && (
                  <MaSelect
                    selectionType={MasraffSelectionType.Multiple}
                    onMaValueCleared={(e) => {
                      console.log("cleared");
                    }}
                    onMaItemSelect={handleItemSelect}
                    ref={inputRef as any}
                    value={selectedItems}
                  >
                    <MaTagInput
                      placeholder={"Seciniz"}
                      slot="select-target"
                      fillStyle={MasraffFillStyle.Solid}
                      size={MasraffSize.Normal}
                      showClearAffordance
                      onMaBlur={() => {
                        if (editing) {
                          setIsEditing(undefined);
                        }
                      }}
                    >
                      <MaIcon
                        iconName={MasraffIconNames.CaretDown}
                        slot="right"
                      />
                    </MaTagInput>
                    <MaPopover>
                      <MaList>
                        {localUsers &&
                          localUsers.map((value) => {
                            return (
                              <MaListItem
                                key={`key-${value.id}`}
                                value={value.id}
                                label={value.name}
                              >
                                <span>{value.name}</span>
                              </MaListItem>
                            );
                          })}
                      </MaList>
                    </MaPopover>
                  </MaSelect>
                )}
              </form>
            </MaGridRow>
          </MaGrid>
        </MaDrawerContent>
        <MaDrawerFooter>
          <MaButton
            fillStyle={MasraffFillStyle.Solid}
            colorType={MasraffColorType.Primary}
            onMaClick={setApproversToBranch}
          >
            {t("labels.save")}
          </MaButton>{" "}
        </MaDrawerFooter>
      </MaDrawer>
    </>
  );
}
