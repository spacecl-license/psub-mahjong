import { useLoaderData } from '@remix-run/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { NFTS } from '~/common/nfts';
import  NftCard  from '~/components/items/nft';
import BasicHeader from '~/components/section/basic-header';

import type { loader } from './server';

export { loader, meta } from './server';

const BuyNft = () => {
  const { canBuyGameLevel } = useLoaderData<typeof loader>();

  const NftCards = useMemo(() => {
    return Object.entries(NFTS).map(([key, nft]) => {
      let isSale = false;

      // if (nft.level === canBuyGameLevel) {
      //   isSale = true;
      // }

      if (nft.level >= 0 && nft.level <= 3) {
        isSale = true;
      } else if (nft.level >= 4 && nft.level <= 5 && canBuyGameLevel > 3) {
        isSale = true;
      } else if (nft.level >= 6 && nft.level <= 7 && canBuyGameLevel > 5) {
        isSale = true;
      } else if (nft.level >= 8) {
        isSale = false;
      }

      // if (nft.level === 0 && canBuyGameLevel === 1) {
      //   isSale = true;
      // }

      // if (canBuyGameLevel > 7) {
      //   isSale = false;
      // }

      return (
        <NftCard
          key={key}
          month={nft.month}
          imagePath={nft.imageUrl}
          points={nft.price.PsuB}
          sale={isSale}
          name={nft.name}
        />
      );
    });
  }, [NFTS, canBuyGameLevel]);

  return (
    <>
      <BasicHeader>
        BUY NFT
      </BasicHeader>
      <Wrapper>
        {NftCards}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; 
  padding: 1.25rem;
  gap: 1.25rem;

  & > div {
    width: calc(50% - 0.625rem);
  }
`;

export default BuyNft;
