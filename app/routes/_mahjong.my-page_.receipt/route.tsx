import { useLoaderData } from '@remix-run/react';
import React from 'react';
import styled from 'styled-components';

import BasicHeader from '~/components/section/basic-header';
import type Receipt from '~/models/receipt';
import { formatDate } from '~/utils/date';

import type { loader } from './server';

export { loader, meta } from './server';

const ReceiptPage = () => {
  const { receipts } = useLoaderData<typeof loader>();

  const monthlyNames = [
    '松鹤+梅鸟+樱花',
    '松鹤',
    '梅鸟',
    '樱花',
    '黑胡',
    '兰草',
    '牡丹',
    '红胡',
    '空山',
    '菊俊',
    '丹枫',
    '梧桐',
    '雨',
  ];

  // NFT 아이템 컴포넌트
  const NFT = ({
    title, date, level, price, currency, image,
  }: {
    title: string,
    date: string,
    level: number,
    price: number,
    currency: string,
    image: string,
  }) => {
    return (
      <NFTItem>
        <NFTImageWrapper>
          <NFTImage
            src={image}
            alt="NFT"
          />
        </NFTImageWrapper>
        <NFTInfo>
          <NFTTitle>{title}</NFTTitle>
          {level !== 0 &&(
            <NFTLevel>
              LEVEL
              <span>
                {level}
              </span>
            </NFTLevel>
          )}
        </NFTInfo>
        <NFTPriceWrapper>
          <NFTDate>{date}</NFTDate>
          <NFTPrice>
            {price}
            <NFTCurrency>
              {currency}
            </NFTCurrency>
          </NFTPrice>
        </NFTPriceWrapper>
      </NFTItem>
    );
  };
  return (
    <>
      <BasicHeader>RECEIPT</BasicHeader>
      {receipts.map((receipt: Receipt, index: number) => (
        <NFT
          key={index}
          title={monthlyNames[Number(receipt.nft.month)]}
          date={formatDate(receipt.createdAt, 'YYYY.MM.DD HH:mm:ss')}
          level={receipt.nft.level}
          price={receipt.nft.price[receipt.token]}
          currency={receipt.token}
          image={receipt.nft.imageUrl}
        />
      ))}
    </>
  );
};

const NFTItem = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-bottom-color);
  background-color: var(--reward-bg2);
`;

const NFTImageWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: black; 
  display: flex;
  justify-content: center;
  align-items: center; 
`;

const NFTImage = styled.img`
  width: 50%;
  height: auto; 
`;

const NFTInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 1rem;
`;

const NFTTitle = styled.div`
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1rem;
  text-transform: uppercase;
  color: var(--font-color);
`;

const NFTDate = styled.div`
  font-family: Montserrat;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; 
  color: var(--receipt-date-color);
`;

const NFTLevel = styled.div`
  font-family: "Noto Sans";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: var(--receipt-date-color);
  display: flex;
  align-items: center;
  
  & > span {
    color: var(--receipt-level-color);
    margin-left: 0.31rem;
  }
`;

const NFTPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const NFTPrice = styled.div`
  color: var(--input-dark-sub2); 
  font-family: "Noto Sans";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NFTCurrency = styled.span`
  font-weight: 700;
  color: var(--main-color); 
  font-family: "Noto Sans";
  font-size: 1rem;
  font-style: normal;
  line-height: normal;
  margin-left: 0.25rem;
`;

export default ReceiptPage;
