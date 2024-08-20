import { useFetcher, useLoaderData } from '@remix-run/react';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SvgMainDark from '~/components/icons/main-dark';
import ChartItem from '~/components/items/chart-item';
import LoadingDots from '~/components/items/loading';

import type { loader } from './server';

export { action, loader, meta } from './server';

const Chart = () => {
  const { userRank, coinPrice } = useLoaderData<typeof loader>();
  const fetcher : any = useFetcher();
  const [selectedItems, setSelectedItems] = useState<any[]>([userRank]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [childItems, setChildItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation('chart');

  const handleItemClick = (item: any) => {
    if (activeItem === item.id) {
      setActiveItem(null);
      setChildItems([]);
    } else {
      if (childItems.length > 0 && item.child !== selectedItems[0].child) {
        setSelectedItems(childItems);
        setChildItems([]);
        setActiveItem(item.id);
        setIsLoading(true);

        fetcher.submit(
          { userId: item.id, level: Number(item.child) + 1 },
          { method: 'POST' },
        );
      } else {
        setActiveItem(item.id);
        setIsLoading(true);

        fetcher.submit(
          { userId: item.id, level: Number(item.child) + 1 },
          { method: 'POST' },
        );
      }
    }
  };

  const handleFootItemClick = () => {
    setActiveItem(null);
    setSelectedItems([userRank]);
    setChildItems([]);
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data.children) {
      setIsLoading(false);
      setChildItems(fetcher.data.children);
    }
  }, [fetcher.data]);

  return (
    <Wrapper>
      {isLoading && <LoadingDots />}
      <ChartContainer>
        <ChartWrapper
          childNumber={Number(selectedItems[0].child)}
        >
          {selectedItems.map((selectedItem) => (
            <ChartItem
              key={selectedItem.id}
              rank={`HT${selectedItem.rank !== 0 ? selectedItem.rank : ''}`}
              child={selectedItem.child === 0 ? t('自己') : `${selectedItem.child}${t('兄弟')}`}
              name={selectedItem.name}
              sales={Number((Number(formatEther(selectedItem.salesAmount)) * coinPrice.USD).toFixed(1))}
              income={Number((Number(formatEther(selectedItem.incomeAmount)) * coinPrice.USD).toFixed(1))}
              isActive={activeItem === selectedItem.id}
              setIsActive={() => handleItemClick(selectedItem)}
            />
          ))}
        </ChartWrapper>
        {childItems.length > 0 && (
          <ChartWrapper
            childNumber={Number(childItems[0].child)}
          >
            {childItems.map((childItem) => (
              <ChartItem
                key={childItem.id}
                rank={`HT${childItem.rank !== 0 ? childItem.rank : ''}`}
                child={childItem.child === 0 ? t('自己') : `${childItem.child}${t('兄弟')}`}
                name={childItem.name}
                sales={Number((Number(formatEther(childItem.salesAmount)) * coinPrice.USD).toFixed(1))}
                income={Number((Number(formatEther(childItem.incomeAmount)) * coinPrice.USD).toFixed(1))}
                isActive={activeItem === childItem.id}
                setIsActive={() => handleItemClick(childItem)}
              />
            ))}
          </ChartWrapper>
        )}
      </ChartContainer>
      <FootItem
        onClick={handleFootItemClick}
      >
        <SvgMainDark />
      </FootItem>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  padding: 1rem;
  position: relative;
  min-height: calc(100vh - 3rem);
  height: 100%;
`;

const ChartContainer = styled.div`
  display: flex;
  gap: 0.88rem;
`;

const ChartWrapper = styled.div<{childNumber : number}>`
  padding: 0.5rem;
  border: 1px solid transparent;
   background-image: ${({ childNumber }) => {
    switch (childNumber) {
      case 0:
        return 'linear-gradient(#f0f9ff, #f0f9ff), linear-gradient(90deg, #12b8ff 0%, #ff007a 100%, #ff007a 100.01%)';
      case 1:
        return 'linear-gradient(#f0f9ff, #f0f9ff), linear-gradient(90deg, #12b8ff 0%, #12b8ff 100%, #12b8ff 100.01%)';
      case 2:
        return 'linear-gradient(#f0f9ff, #f0f9ff), linear-gradient(90deg, #7599F8 0%, #7599F8 100%, #7599F8 100.01%)';
      case 3:
        return 'linear-gradient(#f0f9ff, #f0f9ff), linear-gradient(90deg, #97AADB 0%, #97AADB 100%, #97AADB 100.01%)';
      case 4:
        return 'linear-gradient(#f0f9ff, #f0f9ff), linear-gradient(90deg, #90C5E3 0%, #90C5E3 100%, #90C5E3 100.01%)';
      default:
        return 'linear-gradient(#f0f9ff, #f0f9ff), linear-gradient(90deg, #8DD6FF 0%, #8DD6FF 100%, #8DD6FF 100.01%)';
    }
  }};
  border-radius: 0.5rem;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  width: calc(50% - 0.44rem);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
`;

const FootItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #fff;
  filter: drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.2));
  cursor: pointer;
  position: fixed;
  bottom: 1.25rem;
  right: 50%;
  transform: translateX(50%);
  z-index: 10;

  & > svg {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }
`;

export default Chart;
