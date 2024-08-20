import { useFetcher, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgClose from '~/components/icons/close';
import InquiryDetailInput from '~/components/input/inquiry-detail-input';
import InquiryInput from '~/components/input/inquiry-input';
import LoadingDots from '~/components/items/loading';
import BasicHeader from '~/components/section/basic-header';

export { action, meta } from './server';

const Inquiry = () => {
  const [files, setFiles] = useState<any>([]);
  const inquiryFetcher = useFetcher();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('inquiry');

  // const handleAttachPictures = async (event : any) => {
  //   const selectedFiles = event.target.files;
  //   const newFiles : any = [];

  //   for (const file of selectedFiles) {
  //     const fileReader = new FileReader();

  //     const readAsDataURL = (file : any) => new Promise((resolve, reject) => {
  //       fileReader.onload = (e : any) => resolve(e.target.result);
  //       fileReader.onerror = (e : any) => reject(e);
  //       fileReader.readAsDataURL(file);
  //     });

  //     try {
  //       const base64 = await readAsDataURL(file);

  //       newFiles.push({
  //         name: file.name,
  //         base64,
  //       });
  //     } catch (error) {
  //       console.error('Error reading file:', error);
  //     }
  //   }
  //   setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  // };

  // const handleRemoveFile = (fileName : any) => {
  //   setFiles(files.filter((file)  => file.name !== fileName));
  // };

  const handleAttachPictures = async (event: any) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length === 0) {
      return;
    }
    const file = selectedFiles[0];
    const fileReader = new FileReader();

    const readAsDataURL = (file: any) => new Promise((resolve, reject) => {
      fileReader.onload = (e: any) => resolve(e.target.result);
      fileReader.onerror = (e: any) => reject(e);
      fileReader.readAsDataURL(file);
    });

    try {
      const base64 = await readAsDataURL(file);
      setFiles([{ name: file.name, base64 }]);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
  };

  const handleInquirySubmit = () => {
    setIsLoading(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (inquiryFetcher.state === 'idle' && inquiryFetcher.data) {
      setIsLoading(false);

      if (!(inquiryFetcher.data as any).error) {
        alert('Inquiry success');
        navigate('/my-page');
      } else {
        alert((inquiryFetcher.data as any).error);
      }
    }
  }, [inquiryFetcher]);

  return (
    <>
      <BasicHeader>
        INQUIRY
      </BasicHeader>
      <Wrapper>
        <inquiryFetcher.Form
          method="post"
          action="/my-page/inquiry"
          encType="multipart/form-data"
          onSubmit={handleInquirySubmit}
        >
          <InquiryInput
            label={t('标题')}
            name="title"
            maxLength={20}
            type="text"
            placeholder={t('请输入标题')}
          />
          <InquiryDetailInput
            label={t('详细信息')}
            maxLength={1000}
            name="detail"
            placeholder={t('请详细输入咨询的明细。回复内容将发送到注册时输入的电子邮件')}
          />
          {files.length > 0 && (
            <>
              <FileList>
                {files.map((file : any, index : number) => (
                  <FileItem key={index}>
                    {file.name}
                    <SvgClose onClick={() => handleRemoveFile()} />
                  </FileItem>
                ))}
              </FileList>
              <input
                type="hidden"
                name="imageFiles"
                value={files[0].base64}
              />
            </>
          )}
          <FileUploadLabel
            htmlFor="file-upload"
          >
            {t('添加图片')}
          </FileUploadLabel>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleAttachPictures}
            style={{ display: 'none' }}
          />
          <BasicButton
            type="submit"
          >
            {t('咨询内容')}
          </BasicButton>
        </inquiryFetcher.Form>
        {isLoading && <LoadingDots />}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  padding: 1.5rem 1.25rem;

  & > Button:last-child {
    margin-top: 4rem;
    margin-bottom:3rem;
  }
`;

const FileList = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  width: 100%;
  padding: 1rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  border-radius: 0.5rem;
  background: var(--inquiry-file-up-background);
`;

const FileItem = styled.div`
  color: var(--inquiry-file-up-color);
  text-align: center;
  font-family: "Noto Sans SC";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > svg {
    cursor: pointer;

    path {
      fill: var(--inquiry-file-up-color);
    }
  }
`;

const FileUploadLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 624.938rem;
  color: var(--inquiry-file-up-button-color);
  background-color: transparent;
  border: 0.0625rem solid var(--inquiry-file-up-button-color);
  width: 100%;
  font-weight: 700;
  cursor: pointer;



  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: silver;
  }
`;

export default Inquiry;
