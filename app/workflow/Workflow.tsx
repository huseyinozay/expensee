"use client";

import _ from "lodash";
import {
  MaAccordion,
  MaButton,
  MaContainer,
  MaIcon,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { conditionNameList, triggerTypeList } from "@/utils/data";
import { useQuery } from "@tanstack/react-query";
import {
  getWorkflowUsers,
  getWorkflowData,
  getSubCompanies,
  getUserGroups,
  getExpenseTypes,
  getTags,
  getDepartments,
  getGrades,
} from "@/app/api/workflow";
import {
  GenericObject,
  WorkflowBranch,
  WorkflowRuleSteps,
  WorkflowStep,
} from "@/utils/types";
import WorkflowDrawer from "@/components/Drawers/WorkflowDrawer";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/Loading/Loading";
import { emptyBranch, emptyStep } from "@/utils/utils";
import {
  MasraffColorType,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";

export default function Workflow() {
  const { t } = useTranslation();
  const [accordionStates, setAccordionStates] = useState<any>([]);
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep>(emptyStep);
  const [selectedBranch, setSelectedBranch] =
    useState<WorkflowBranch>(emptyBranch);
  const [ruleSteps, setRuleSteps] = useState<WorkflowStep[]>([]);
  const [users, setUsers] = useState<GenericObject[]>([]);
  const [userGroups, setUserGroups] = useState<GenericObject[]>([]);
  const [subCompanies, setSubCompanies] = useState<GenericObject[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<GenericObject[]>([]);
  const [tags, setTags] = useState<GenericObject[]>([]);
  const [departments, setDepartments] = useState<GenericObject[]>([]);
  const [grades, setGrades] = useState<GenericObject[]>([]);
  const changeStatus: any = (isOpen: boolean) => {
    setDrawerOpened(isOpen);
  };

  const {
    data: workflowData,
    isSuccess: isSuccessWorkflow,
    isLoading: isLoadingWorkflow,
  } = useQuery<WorkflowRuleSteps[]>({
    queryKey: ["workflowData"],
    staleTime: Infinity,
    queryFn: async () => getWorkflowData(),
    enabled: ruleSteps.length === 0,
  });

  const { data: userData } = useQuery<GenericObject[]>({
    queryKey: ["userData"],
    staleTime: Infinity,
    queryFn: async () => getWorkflowUsers(),
  });

  const { data: subCompanyData } = useQuery<GenericObject[]>({
    queryKey: ["subCompanyData"],
    staleTime: Infinity,
    queryFn: async () => getSubCompanies(),
  });

  const { data: userGroupData } = useQuery<GenericObject[]>({
    queryKey: ["userGroupData"],
    staleTime: Infinity,
    queryFn: async () => getUserGroups(),
  });

  const { data: expenseTypeData } = useQuery<GenericObject[]>({
    queryKey: ["expenseTypeData"],
    staleTime: Infinity,
    queryFn: async () => getExpenseTypes(),
  });

  const { data: tagData } = useQuery<GenericObject[]>({
    queryKey: ["tagData"],
    staleTime: Infinity,
    queryFn: async () => getTags(),
  });

  const { data: departmentData } = useQuery<GenericObject[]>({
    queryKey: ["departmentData"],
    staleTime: Infinity,
    queryFn: async () => getDepartments(),
  });

  const { data: gradeData } = useQuery<GenericObject[]>({
    queryKey: ["gradeData"],
    staleTime: Infinity,
    queryFn: async () => getGrades(),
  });

  useEffect(() => {
    if (userData) {
      setUsers(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (subCompanyData) {
      setSubCompanies(subCompanyData);
    }
  }, [subCompanyData]);

  useEffect(() => {
    if (userGroupData) {
      setUserGroups(userGroupData);
    }
  }, [userGroupData]);

  useEffect(() => {
    if (expenseTypeData) {
      setExpenseTypes(expenseTypeData);
    }
  }, [expenseTypeData]);

  useEffect(() => {
    if (tagData) {
      setTags(tagData);
    }
  }, [tagData]);

  useEffect(() => {
    if (departmentData) {
      setDepartments(departmentData);
    }
  }, [departmentData]);

  useEffect(() => {
    if (gradeData) {
      setGrades(gradeData);
    }
  }, [gradeData]);

  useEffect(() => {
    if (workflowData && workflowData.length > 0 && isSuccessWorkflow) {
      setRuleSteps(workflowData[0].ruleSteps);
    }
  }, [workflowData, isSuccessWorkflow]);

  useEffect(() => {
    const newAccordionStates = ruleSteps.map((item: { branches: any[] }) => {
      return {
        isOpen: false,
        branches: item.branches.map(() => ({ isOpen: false })),
      };
    });
    setAccordionStates(newAccordionStates);
  }, [ruleSteps]);

  const toggleAccordion = (
    index: number,
    isBranch: boolean,
    branchIndex: number = 0
  ) => {
    const newStates = [...accordionStates];
    const state = newStates[index];
    if (isBranch) {
      state.branches[branchIndex].isOpen = !state.branches[branchIndex].isOpen;
    } else {
      state.isOpen = !state.isOpen;
    }
    setAccordionStates(newStates);
  };

  const updateRuleSteps = () => {
    const updatedRuleSteps = [...ruleSteps];
    const stepIndex = selectedStep.startIndex;

    if (
      updatedRuleSteps[stepIndex].branches[selectedBranch.index] !==
      selectedBranch
    ) {
      updatedRuleSteps[stepIndex].branches[selectedBranch.index] =
        selectedBranch;

      setRuleSteps(updatedRuleSteps);
    }
  };

  useEffect(() => {
    if (ruleSteps.length !== 0) updateRuleSteps();
  }, [selectedBranch]);

  const getFunctionNameText = (input: any) => {
    return _.find(conditionNameList, { name: input }).description;
  };

  const getTriggerTypeText = (
    currentTriggerTypeIndex: any,
    currentTriggerTypeList: any
  ) => {
    const currentTriggerTypeListIndex =
      currentTriggerTypeList[currentTriggerTypeIndex];

    return _.find(triggerTypeList, { index: currentTriggerTypeListIndex })
      .description;
  };
  const allLists = {
    1: users,
    2: departments,
    4: tags,
    5: subCompanies,
    7: expenseTypes,
    12: userGroups,
    21: grades,
  };
  const getTriggers = (data: any) => {
    if (
      data.condition &&
      data.condition.triggerType &&
      data.condition.conditionText
    ) {
      const conditionTriggerTypeList = data.condition.triggerType;
      const arr = _.reject(
        _.split(data.condition.conditionText, new RegExp("(\\(|\\))", "g")),
        _.isEmpty
      );

      const resultList = [];
      let currentFunctionIndexList = [];
      for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
        const arrItem = _.trim(arr[arrIndex]);

        if (/_./.test(arrItem)) {
          currentFunctionIndexList.push(arrIndex);
          currentFunctionIndexList.push(arrIndex + 1);
          currentFunctionIndexList.push(arrIndex + 2);
          currentFunctionIndexList.push(arrIndex + 3);

          let currentOperator = "";
          const functionItemList = _.reject(_.split(arrItem, "_."), _.isEmpty);

          if (_.gt(functionItemList.length, 1)) {
            const operatorName = _.trim(_.first(functionItemList));
            currentOperator = `${
              _.eq(operatorName, "&&") ? " ve " : " veya "
            } `;
          }

          // getMethodName
          const functionName = _.last(functionItemList);
          // functionName = lte
          const functionNameText = getFunctionNameText(functionName);
          // functionNameText = 'İçerir'

          // getValueText
          const texts = arr[arrIndex + 2];
          const textList = _.split(texts, "VALUE");
          // textList[0] = '10000,'
          // textList[1] = [0]

          const valueTextIndex = +_.words(
            textList[1],
            new RegExp("[0-9]w*", "g")
          )[0];
          const triggerTypeText = getTriggerTypeText(
            valueTextIndex,
            conditionTriggerTypeList
          );
          // triggerTypeText = 'Toplam Tutar'
          let valueText = _.trim(textList[0]).slice(0, -1);

          // 8 12
          const triggerTypeValue = conditionTriggerTypeList[valueTextIndex];
          valueText = getConditionTextInTurkishWithNames(
            valueText,
            triggerTypeText,
            triggerTypeValue
          );
          resultList.push(
            `${currentOperator}${triggerTypeText} ${functionNameText} ${valueText}`
          );
          // texts: veya Toplam Tutar Küçük Eşit 10000
        } else if (_.eq(arrItem, "||")) {
          const valueText = " veya ";
          currentFunctionIndexList = [];
          resultList.push(valueText);
        } else if (_.eq(arrItem, "&&")) {
          const valueText = " ve ";
          currentFunctionIndexList = [];
          resultList.push(valueText);
        } else if (!_.includes(currentFunctionIndexList, arrIndex)) {
          currentFunctionIndexList = [];
          resultList.push(arrItem);
        }
      }

      return `Koşul: ${_.join(resultList, "")}`;
    } else if (data.condition && data.condition.triggerType) {
      // Linear son onayci vs.
    }

    return "";
  };

  function getConditionTextInTurkish(
    conditionText: any,
    triggerTypeText: string | any[]
  ) {
    let translatedText = conditionText
      .replace(/&&/g, " ve ")
      .replace(/\|\|/g, " veya ")
      .replace(/_/g, "")
      .replace(/\./g, " ")
      .replace(/\(\(/g, "(")
      .replace(/\)\)/g, ")");

    translatedText = translatedText.replace(/includes/g, "içerir");
    translatedText = translatedText.replace(/lte/g, "büyük eşit");
    translatedText = translatedText.replace(/eq/g, "eşittir");
    translatedText = translatedText.replace(/isNil/g, "boş değil");

    for (let i = 0; i < triggerTypeText.length; i++) {
      const pattern = new RegExp(`VALUE\\[${i}\\]`, "g");
      translatedText = translatedText.replace(pattern, triggerTypeText[i]);
    }

    return translatedText;
  }

  function getTriggerTypeInTurkish(typeIndex: any) {
    const triggerType = triggerTypeList.find((tt) => tt.index === typeIndex);
    return triggerType ? triggerType.description : "";
  }

  function getConditionTextInTurkishWithNames(
    conditionText: any,
    triggerTypeText: string | any[],
    triggerType: string | number
  ) {
    let translatedText = getConditionTextInTurkish(
      conditionText,
      triggerTypeText
    );

    //@ts-ignore
    const relevantList = allLists[triggerType];
    if (!relevantList) return translatedText;

    const regex = /(\[(.*?)\])|(VALUE\[(\d+)\])|(\d+)/g;

    let match;
    while ((match = regex.exec(translatedText)) !== null) {
      if (match[1]) {
        // Köşeli parantez varsa
        const ids = match[2].split(",").map(Number);
        const names = findNamesByIds(ids, relevantList);
        translatedText = translatedText.replace(
          match[1],
          `[${names.join(", ")}]`
        );
      } else if (match[3]) {
        // VALUE[x] varsa
        const index = Number(match[4]);
        const name = triggerTypeText[index];
        translatedText = translatedText.replace(match[3], name);
      } else if (match[5]) {
        // Düz sayı varsa
        const id = Number(match[5]);
        const name = findNamesByIds([id], relevantList);
        translatedText = translatedText.replace(id, name);
      }
    }

    return translatedText;
  }

  function findNamesByIds(ids: any[], list: any[]) {
    return ids.map((id) => {
      const item = list.find((x) => x.id === id);
      return item ? item.name : id;
    });
  }

  function evalConditionForUI(condition: {
    triggerType: any;
    conditionText: any;
  }) {
    let uiString = "";

    if (condition) {
      let triggerTypeText = [];

      if (condition.triggerType) {
        for (const i in condition.triggerType) {
          triggerTypeText.push(
            getTriggerTypeInTurkish(condition.triggerType[i])
          );
        }
        uiString += `${triggerTypeText.join(" ve ")}`;
      }

      if (condition.conditionText) {
        const conditionText = getConditionTextInTurkishWithNames(
          condition.conditionText,
          triggerTypeText,
          condition.triggerType[0]
        );
        uiString += " için koşul: " + conditionText;
      }
    }

    return uiString;
  }

  return (
    <>
      {isDrawerOpened && (
        <WorkflowDrawer
          isOpen={isDrawerOpened}
          changeStatus={changeStatus}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          users={users}
        />
      )}
      <MaContainer elevation="zero" padding={16} fullWidth direction="column">
        <h5>Workflow</h5>
        <MaContainer
          fullWidth
          className="ma-size-margin-top-8"
          direction="column"
        >
          {isLoadingWorkflow ? (
            <Loading />
          ) : (
            ruleSteps.map((step, index) => (
              <MaContainer
                key={index}
                fullWidth
                elevation="one"
                borderRadius={6}
                padding={8}
                className="ma-size-margin-bottom-8"
                direction="column"
              >
                <MaContainer
                  fullWidth
                  className="ma-display-flex-justify-content-spacebetween"
                  onMaClick={() => {
                    toggleAccordion(index, false);
                    setSelectedStep(step);
                  }}
                >
                  <MaContainer
                    direction="column"
                    padding={4}
                    borderRadius={6}
                    onMaClick={() => {
                      toggleAccordion(index, false);
                      setSelectedStep(step);
                    }}
                  >
                    <MaText className="ma-body-text-weight-bold">
                      Step [{step.startIndex}-{step.endIndex}]
                    </MaText>

                    {/*{getTriggers(step)}*/}
                    <br />
                    <MaText>
                      {/*{step.condition*/}
                      {/*    ? evalConditionForUI(step.condition)*/}
                      {/*    : ""}*/}
                      {/*{getTriggers(step)}*/}
                    </MaText>
                    <br />
                    <MaText>
                      {/*{step.condition*/}
                      {/*    ? evalConditionForUI(step.condition)*/}
                      {/*    : ""}*/}
                      {getTriggers(step)}
                    </MaText>

                    {/* {getCondition(step)} */}
                  </MaContainer>
                  <MaButton
                    onMaClick={() => {
                      toggleAccordion(index, false);
                      setSelectedStep(step);
                    }}
                  >
                    <MaIcon
                      color={MasraffColorType.Primary}
                      iconName={
                        accordionStates[index]?.isOpen
                          ? MasraffIconNames.ChevronUp
                          : MasraffIconNames.ChevronBottom
                      }
                    />
                  </MaButton>
                </MaContainer>

                {accordionStates[index]?.isOpen && (
                  <MaContainer fullWidth>
                    <MaAccordion
                      className="ma-size-margin-top-16"
                      isOpen={accordionStates[index]?.isOpen}
                    >
                      <MaContainer direction="column">
                        {step.branches.map((branch, branchIndex) => (
                          <MaContainer
                            key={branchIndex}
                            direction="column"
                            horizontalGap={16}
                            padding={16}
                            fullWidth
                            elevation="one"
                            margin={8}
                            borderRadius={6}

                            // backgroundColor={{
                            //   color: MasraffColorName.Ultraviolet,
                            //   shadeName: MasraffColorShadeName.Lightest,
                            // }}
                          >
                            <MaContainer
                              fullWidth
                              verticalGap={16}
                              onMaClick={() =>
                                toggleAccordion(index, true, branchIndex)
                              }
                            >
                              <MaButton
                                onMaClick={() => {
                                  changeStatus(true);
                                  setSelectedBranch(branch);
                                }}
                              >
                                Branch {branchIndex}
                              </MaButton>
                              <MaButton
                                onMaClick={() =>
                                  toggleAccordion(index, true, branchIndex)
                                }
                              >
                                <MaIcon
                                  color={MasraffColorType.Primary}
                                  iconName={
                                    accordionStates[index]?.branches?.[
                                      branchIndex
                                    ]?.isOpen
                                      ? MasraffIconNames.ChevronUp
                                      : MasraffIconNames.ChevronBottom
                                  }
                                />
                              </MaButton>
                            </MaContainer>
                            {accordionStates[index]?.branches?.[branchIndex]
                              ?.isOpen && (
                              <MaContainer>
                                <MaAccordion
                                  isOpen={
                                    accordionStates[index]?.branches?.[
                                      branchIndex
                                    ]?.isOpen
                                  }
                                >
                                  <MaContainer direction="column">
                                    {/*{getTriggers(branch)}*/}
                                    {/*<br/>*/}
                                    <MaText className="ma-body-text-weight-bold">
                                      Kural
                                    </MaText>
                                    {getTriggers(branch)}
                                    {/*<br/>*/}
                                    {/*{branch.condition*/}
                                    {/*? evalConditionForUI(branch.condition)*/}
                                    {/*: "-"}*/}
                                    <br />
                                    <MaText className="ma-body-text-weight-bold">
                                      Onaycılar
                                    </MaText>

                                    {branch.approvers
                                      ? branch.approvers.map(
                                          (approver, approverIndex) => (
                                            <MaContainer
                                              key={approverIndex}
                                              direction="column"
                                            >
                                              {`${approverIndex + 1}. ${
                                                users.find(
                                                  (x) =>
                                                    x.id === approver.userId
                                                )?.name
                                              }`}
                                            </MaContainer>
                                          )
                                        )
                                      : "-"}
                                  </MaContainer>
                                </MaAccordion>
                              </MaContainer>
                            )}
                          </MaContainer>
                        ))}
                      </MaContainer>
                    </MaAccordion>
                  </MaContainer>
                )}
              </MaContainer>
            ))
          )}
        </MaContainer>
      </MaContainer>
    </>
  );
}
