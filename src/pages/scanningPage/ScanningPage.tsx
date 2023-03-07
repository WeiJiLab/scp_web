import React, { useEffect, useRef, useState } from 'react';
import { MainLayout } from '../../components';
import {
  Select,
  Space,
  Button,
  message,
  Upload,
  UploadProps,
  Progress,
  List,
  Typography,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { authAxios } from '../../api';

export const ScanningPage: React.FC = () => {
  const timer = useRef<any>();
  const [percent, setPercent] = useState<number>();
  const [fileType, setFileType] = useState<string>('0');
  const [stepsData, setStepsData] = useState<string[]>();
  const [projectId, setProjectId] = useState<string[]>();

  const [loadings, setLoadings] = useState<boolean[]>([]);

  const { Dragger } = Upload;

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[0] = false;
        return newLoadings;
      });
    };
  }, []);

  const startScan = async () => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = true;
      return newLoadings;
    });
    const { data } = await authAxios.post('/image-scan/start', {
      typeOption: fileType,
      projectName: '',
    });
    setProjectId(data);
    getDetail(data);
  };
  const stopScan = async () => {
    await authAxios.post('/image-scan/stop', {
      projectId: projectId,
      typeOption: fileType,
    });
    clearInterval(timer.current);
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = false;
      return newLoadings;
    });
  };
  const download = () => {
    authAxios.get(`/image-scan/reports/${projectId}`);
  };
  const getDetail = (projectId: string) => {
    timer.current = setInterval(async () => {
      const { data } = await authAxios.get(`/image-scan/stage-status/${projectId}`);
      const percent = Math.round((data.length / 6) * 100);
      setPercent(percent);
      const steps = (await authAxios.get(`/image-scan/steps/${projectId}`))['data'].map((item) => {
        return item.result;
      });
      setStepsData(steps);
      console.log(percent);
      if (percent === 100) {
        clearInterval(timer.current);
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[0] = false;
          return newLoadings;
        });
      }
    }, 5000);
  };
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleChange = (value: string) => {
    setFileType(value);
    console.log(`selected ${value}`);
  };

  return (
    <MainLayout>
      <Space>
        <Select
          defaultValue={fileType}
          style={{ width: 150 }}
          onChange={handleChange}
          options={[
            { value: '0', label: '内核源码扫描' },
            { value: '1', label: '内核镜像扫描' },
            { value: '2', label: '其他' },
          ]}
        />
        <Button type='primary' loading={loadings[0]} onClick={startScan}>
          启动扫描
        </Button>
        <Button type='primary' onClick={stopScan}>
          停止扫描
        </Button>
        <Button type='primary' icon={<DownloadOutlined />} onClick={download} />
      </Space>
      {/* <Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag file to this area to upload</p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p>
      </Dragger> */}
      <Progress percent={percent} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
      <List
        header={<div></div>}
        footer={<div></div>}
        bordered
        dataSource={stepsData}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text mark></Typography.Text> {item}
          </List.Item>
        )}
      />
    </MainLayout>
  );
};
