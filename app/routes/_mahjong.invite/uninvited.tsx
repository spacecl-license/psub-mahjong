import { Link } from '@remix-run/react';
import React from 'react';
import styled from 'styled-components';

import BasicButton from '~/components/button/basic-button';
import SvgNoNft from '~/components/icons/no-nft';

const Uninvited = () => {
  return (
    <Wrapper>
      <div>
        <SvgNoNft />
        {`You must purchase nft to receive the 
        referral code.`}
        <Link to="/my-page/buy-nft">
          <BasicButton >PURCHASE NFT</BasicButton>
        </Link>
      </div>
    </Wrapper>
  );
};

export default Uninvited;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding : 0rem 1.25rem 4rem 1.25rem;
  gap: 2rem;
  max-width: 31.25rem; 
  background-color: var(--bg-color);
  width: 100%;



  & > div:last-child {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    font-family: "Noto Sans";
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    white-space: pre-line;
    color: var(--font-color);

    & > svg {
      width: 5rem;
      height: 5.428rem;
      margin-bottom: 1.5rem;
      margin-top: 2rem;

      path {
        fill: var(--invite-icon);
      }
    }

    & > a {
      width : 100%;
      & > button {
      margin: 2.5rem 0;
      text-align: center;
      font-family: Montserrat !important;
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
      text-transform: uppercase;
      padding-top : 0.75rem;
    }
    }

  }
`;
