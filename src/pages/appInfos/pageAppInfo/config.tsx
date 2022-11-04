import React from "react";
import { BaseModel } from "../../../@types";
import { ProColumns } from "@ant-design/pro-components";
import { DatePicker } from "antd";

const {RangePicker} = DatePicker;

export interface TableListItem extends BaseModel {
  name: string;
  description: string;
  projectId: number;
  repoType: string;
}

export const columns: ProColumns<TableListItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInTable: true,
    search: false,
  },
  {
    title: '应用名称',
    dataIndex: 'name',
    ellipsis: true,
    tip: '项目名称过长会自动收缩',
  },
  {
    title: '应用描述',
    dataIndex: 'description',
    ellipsis: true,
    search: false,
    tip: '项目描述过长会自动收缩',
  },
  {
    title: 'OwnerId',
    dataIndex: 'projectId',
  },
  {
    title: '仓库类型',
    dataIndex: 'repoType',
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date',
    search: false,
    renderFormItem: () => {
      return <RangePicker/>;
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    valueType: 'date',
    search: false,
    hideInTable: false,
  },
  {
    width: 150,
    title: '操作',
    valueType: 'option',
    key: 'option',
    fixed: 'right',
    render: (text, record, index, action) => [
      // <UpdateProject id={record.id} name={record.name} description={record.description}/>,
      <a onClick={() => {
        console.log("text", text);
        console.log("record", record);
        console.log("index", index);
        console.log("action", action);
      }}>
        查看
      </a>,
      // <DeleteProject id={record.id}/>
    ],
  }
]

