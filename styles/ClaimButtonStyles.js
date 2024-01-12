import styled from 'styled-components';
import * as globalStyles from './globalStyles';

export const ContainerWithBackground = styled(globalStyles.Container)`
  padding: 24px;
  background-color: var(--primary);
`;

export const CenteredContainer = styled(globalStyles.Container)`
  justify-content: center;
  align-items: center;
`;

export const AccentContainer = styled(CenteredContainer)`
  background-color: var(--accent);
  padding: 24px;
  border-radius: 24px;
  border: 4px dashed var(--secondary);
  box-shadow: 0px 5px 11px 2px rgba(0,0,0,0.7);
`;

export const CenteredTextTitle = styled(globalStyles.TextTitle)`
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: var(--accent-text);
`;

export const CenteredTextDescription = styled(globalStyles.TextDescription)`
  text-align: center;
  color: var(--primary-text);
`;

// 追加するスタイル
export const StyledLogo = styled.img`
  width: 150px;
  height: 150px;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledImg = styled.img`
  width: 100%;
  height: auto;
`;

export const StyledLink = styled.a`
  color: var(--accent-text);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
