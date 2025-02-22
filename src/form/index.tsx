// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

import { AnalyticsFunnel, AnalyticsFunnelStep } from '../internal/analytics/components/analytics-funnel';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import { useFunnel, useFunnelNameSelector, useFunnelStep } from '../internal/analytics/hooks/use-funnel';

import styles from './styles.css.js';

export { FormProps };

const FormWithAnalytics = ({ variant = 'full-page', actions, ...props }: FormProps) => {
  const { funnelProps, funnelSubmit, funnelNextOrSubmitAttempt } = useFunnel();
  const { funnelStepProps } = useFunnelStep();

  const handleActionButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
      funnelNextOrSubmitAttempt();
      funnelSubmit();
    }
  };

  return (
    <ButtonContext.Provider value={{ onClick: handleActionButtonClick }}>
      <InternalForm variant={variant} actions={actions} {...props} {...funnelProps} {...funnelStepProps} />
    </ButtonContext.Provider>
  );
};

export default function Form({ variant = 'full-page', ...props }: FormProps) {
  const baseComponentProps = useBaseComponent('Form');
  const inheritedFunnelNameSelector = useFunnelNameSelector();
  const funnelNameSelector = inheritedFunnelNameSelector || `.${styles.header}`;

  return (
    <AnalyticsFunnel
      funnelType="single-page"
      optionalStepNumbers={[]}
      totalFunnelSteps={1}
      funnelNameSelector={funnelNameSelector}
    >
      <AnalyticsFunnelStep stepNumber={1} stepNameSelector={funnelNameSelector}>
        <FormWithAnalytics variant={variant} {...props} {...baseComponentProps} />
      </AnalyticsFunnelStep>
    </AnalyticsFunnel>
  );
}

applyDisplayName(Form, 'Form');
