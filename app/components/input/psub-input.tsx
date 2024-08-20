import React from 'react';
import styled from 'styled-components';

import SvgPsub from '~/components/icons/psub';
import BasicInput from '~/components/input/basic-input';

interface PsubInputProps {
  label: string;
  value: any;
  usdEquivalent: number;
  yenEquivalent: number;
}

const PsubInput: React.FC<PsubInputProps> = ({
  label,
  value,
  usdEquivalent,
  yenEquivalent,
}) => {
  return (
    <BasicInput label={label}>
      <UnitGroupWrapper>
        <SvgPsub />
        <UnitGroup>
          <InputGroup>
            <div>{value}</div>
            <span>PsuB</span>
          </InputGroup>
          <label>
            {`≈ ${usdEquivalent} USD // ${yenEquivalent} ¥`}
          </label>
        </UnitGroup>
      </UnitGroupWrapper>
    </BasicInput>
  );
};

const UnitGroupWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > svg {
    width: 2.5rem;
    height: 2.5rem;
    path {
      fill: var(--nft-svg);
    }
  }
`;

const UnitGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & > label {
    color: var(--calendar-tap-color);
    text-align: right;
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
    text-transform: uppercase;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  
  & > div {
    text-align: center;
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    text-align: right;
    color : var(--font-color);
  }

  & > span {
    color: var(--nft-svg);
    text-align: center;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem; 
  }
`;

export default PsubInput;
