import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {App, AccountIF} from '../state/store';
import {observer} from 'mobx-react';
import styled from 'styled-components/native';
import {RFPercentage} from 'react-native-responsive-fontsize';

const theme = App.theme;

const AccountCard = observer(({account}: {account: AccountIF}) => {
  const AccountContainer = styled.View`
    border: 2px solid ${theme.secondary};
    width: ${RFPercentage(40)}px;
    border-radius: 20px;
    height: ${RFPercentage(25)}px;
    background: ${theme.secondary}dd;
    margin: 0 5px 0 10px;
    justify-content: space-between;
    padding: 10px 10px;
  `;
  const TextBase = styled.Text`
    font-family: ${theme.primaryFont.MEDIUM};
  `;
  const AccountHeading = styled(TextBase)`
    font-size: 30px;
  `;
  const MinorHeading = styled(TextBase)`
    font-size: 20px;
  `;
  const ContentHeading = styled(TextBase)`
    font-size: 15px;
  `;
  const MoneyText = styled(TextBase)`
    font-size: 26px;
    color: ${theme.primary};
  `;
  const MoneyContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
  `;

  return (
    <AccountContainer>
      <AccountHeading>{account.accountLabel}</AccountHeading>
      <MinorHeading>
        Available Balance
        {'\n'}
        <MoneyText>₹&nbsp;{account.credit - account.debit}</MoneyText>
      </MinorHeading>

      <MoneyContainer>
        <View>
          <ContentHeading>Income</ContentHeading>
          <MoneyText>₹&nbsp;{account.credit}</MoneyText>
        </View>
        <View>
          <ContentHeading>Expense</ContentHeading>
          <MoneyText>₹&nbsp;{account.debit}</MoneyText>
        </View>
      </MoneyContainer>
    </AccountContainer>
  );
});

export default AccountCard;
