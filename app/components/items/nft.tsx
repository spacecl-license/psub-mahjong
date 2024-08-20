import { Link } from '@remix-run/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useTheme } from '~/hooks/use-theme';
import { toComma } from '~/utils/utils';

import SvgProhibition from '../icons/prohibition';
import SvgPsub from '../icons/psub';

interface NftCardProps {
  month: number;
  imagePath: string;
  points: number;
  sale: boolean;
  name: string;
}

const NftCard: React.FC<NftCardProps> = ({
  month, imagePath, points, sale, name,
}) => {
  const { t } = useTranslation('buy-nft');
  const [theme] = useTheme();
  return (
    <div>
      {sale ? (
        <Link to={month === 0 ? `/my-page/buy-random-box/${month}` : `/my-page/buy-nft-detail/${month}`}>
          <CardContainer
            theme={theme}
            sale={sale}
          >
            <CardHeader>
              {name}
            </CardHeader>
            <CardImageWrapper>
              <CardImage
                src={imagePath}
                alt="Reward"
              />
            </CardImageWrapper>
            <CardFooter>
              <SvgPsub />
              <FooterWrapper>
                {toComma(points)}
                <Currency>PsuB</Currency>
              </FooterWrapper>
            </CardFooter>
          </CardContainer>
        </Link>
      ) : (
        <CardContainer
          theme={theme}
          sale={sale}
        >
          <CardHeader
            opacity
            theme={theme}
          >
            {name}
          </CardHeader>
          <CardImageWrapper
            opacity
            theme={theme}
          >
            <CardImage
              src={imagePath}
              alt="Reward"
              opacity
            />
          </CardImageWrapper>
          <Prohibited>
            <SvgProhibition />
          </Prohibited>
          <CardFooter>
            <LEVELUP>{t('需要提升等级')}</LEVELUP>
          </CardFooter>
        </CardContainer>
      )}
    </div>
  );
};

const CardContainer = styled.div<{theme : string, sale : boolean}>`
  width: 100%;
  border-radius: 1rem; 
  display: flex;
  flex-direction: column; 
  background-color: white;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: ${({ theme, sale }) => {
    if (theme === 'dark') {
      if (sale){
        return '0px 0px 7px 0px rgba(18, 184, 255, 0.70)';
      } else {
        return 'none';
      }
    } else {
      return '0px 0px 7px 0px rgba(0, 0, 0, 0.25)';
    }
  }
};
  position: relative;
  border: ${({ theme, sale }) => {
    if (theme === 'dark') {
      if (sale){
        return '1px solid var(--dark-sub)';
      } else {
        return '1px solid var(--dark-gray-3)';
      }
    } else {
      return 'none';
    }
  }};
`;

const CardHeader = styled.div <{ opacity?: boolean, theme : string }>`
  background-color: var(--nft-header); 
  color: white; 
  border-top-left-radius: 0.8rem; 
  border-top-right-radius: 0.8rem;
  font-family: "Noto Sans";
  font-size: 1.04rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; 
  text-align: center;
  opacity: ${({ opacity, theme }) => (opacity && theme === 'light' ? 0.5 : 1)};
`;

const CardImageWrapper = styled.div<{ opacity?: boolean, theme : string }>`
  width: 100%;
  background-color: black; 
  height: calc(50vw - 2rem);
  padding : 25%;
  opacity: ${({ opacity, theme }) => (opacity && theme === 'light' ? 0.5 : 1)};
  display: flex;
  justify-content: center;
  align-items: center; 
  overflow: hidden;
`;

const CardImage = styled.img<{opacity?: boolean}>`
  width: 150%;
  height: auto; 
  opacity: ${({ opacity }) => (opacity ? 0.5 : 1)};
`;

const Prohibited = styled.div`
  top: 50%;
  left: 50%;
  position: absolute;

  & > svg {
    width: 7rem;
    height: 7rem;
    transform: translate(-50%, -60%);

    path {
      fill: var(--nft-prohibit);
    }

  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 1rem 0.5rem; 
  font-size: 1rem; 
  line-height: 1.375rem;
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  background-color: var(--nft-footer);


  & > svg {
    width: 1.25rem;
    height: 1.25rem;
  
    path {
      fill: var(--nft-svg);
    }
  }
`;

const Currency = styled.span`
  color: var(--nft-font-color2);
  font-family: "Noto Sans";
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.375rem;
  margin-left: 0.2rem; 
`;

const LEVELUP = styled.div`
  width: 100%;
  color: var(--nft-font-color);
  text-align: center;
  font-family: "Noto Sans";
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  text-transform: uppercase;
  opacity: 1;
`;

const FooterWrapper = styled.div`
  color: var(--font-color);
`;

export default NftCard;
