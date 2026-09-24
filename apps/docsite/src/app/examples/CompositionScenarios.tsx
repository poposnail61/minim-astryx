// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @input Existing components, with long labels, media and feedback states.
 * @output Additional real-world compositions for visual review.
 * @position Minim examples; all actions affect local demonstration state only.
 */
import {useState} from 'react';
import {Stack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {Switch} from '@astryxdesign/core/Switch';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Token} from '@astryxdesign/core/Token';
import {Banner} from '@astryxdesign/core/Banner';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Spinner} from '@astryxdesign/core/Spinner';

export function SettingsScenario() {
  const [channel, setChannel] = useState('email');
  const [alerts, setAlerts] = useState(true);
  const [digest, setDigest] = useState(false);
  const [consent, setConsent] = useState(true);
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap={5} maxWidth={760}>
      <Heading level={2}>계정 설정</Heading>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <Avatar
          name="Ana Thomas"
          src="/template-assets/DATA-Ana-Thomas.png"
          size="lg"
        />
        <Stack gap={1}>
          <Text type="large">김민지</Text>
          <Text type="supporting">여행 운영팀 · 관리자</Text>
        </Stack>
      </Stack>
      <Divider />
      <Heading level={3}>알림 수신</Heading>
      <Switch
        label="예약 변경 및 결제 확인 알림을 실시간으로 받습니다."
        value={alerts}
        onChange={value => {
          setAlerts(value);
          setSaved(false);
        }}
      />
      <Switch
        label="처리가 끝나지 않은 예약을 매일 아침 요약해서 받습니다."
        size="lg"
        value={digest}
        onChange={value => {
          setDigest(value);
          setSaved(false);
        }}
      />
      <RadioList
        label="기본 수신 채널"
        value={channel}
        onChange={value => {
          setChannel(value);
          setSaved(false);
        }}>
        <RadioListItem label="이메일로 받기" value="email" />
        <RadioListItem label="등록된 휴대전화로 문자 메시지 받기" value="sms" />
      </RadioList>
      <CheckboxInput
        label="업무 알림 수신을 위해 연락처를 사용하는 데 동의합니다."
        value={consent}
        onChange={value => {
          setConsent(value);
          setSaved(false);
        }}
      />
      <Stack direction="horizontal" hAlign="end">
        <Button
          label="설정 저장"
          onClick={() => setSaved(true)}
          isDisabled={!consent}
        />
      </Stack>
      {saved && <Banner status="success" title="알림 설정이 저장되었습니다." />}
    </Stack>
  );
}

export function DetailScenario() {
  const [paid, setPaid] = useState(false);
  return (
    <Stack gap={5}>
      <Stack
        direction="horizontal"
        wrap="wrap"
        gap={3}
        hAlign="between"
        vAlign="center">
        <Heading level={2}>도쿄 3박 4일</Heading>
        <Token
          label={paid ? '결제 완료' : '결제 대기'}
          color={paid ? 'blue' : 'amber'}
        />
      </Stack>
      <Text color="secondary">YT-2401 · 2026. 10. 12 – 10. 15 · 성인 2명</Text>
      <ProgressBar label="예약 준비" value={paid ? 100 : 60} hasValueLabel />
      <Grid columns={{minWidth: 280, max: 2, repeat: 'fit'}} gap={4}>
        <Card>
          <Stack gap={3}>
            <Heading level={3}>김민지</Heading>
            <Stack direction="horizontal" gap={3} vAlign="center">
              <Avatar name="Minji Kim" size="md" />
              <Text>대표 예약자</Text>
            </Stack>
            <Text type="supporting">minji@example.com</Text>
            <Text>동행 1명 · 여권 정보 확인 완료</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap={3}>
            <Heading level={3}>결제 내역</Heading>
            <Text type="large">1,280,000원</Text>
            <Text type="supporting">항공 및 숙박 포함</Text>
            <Button
              label={paid ? '결제 확인 완료' : '결제 확인'}
              isDisabled={paid}
              onClick={() => setPaid(true)}
            />
          </Stack>
        </Card>
      </Grid>
      <Heading level={3}>출발 전 확인</Heading>
      <Banner
        status={paid ? 'success' : 'warning'}
        title={
          paid
            ? '출발 준비가 완료되었습니다.'
            : '결제 확인 후 최종 예약서를 발송합니다.'
        }
      />
      <Text>
        출발 2시간 전까지 공항에 도착해주세요. 항공편 변경 시 등록된 연락처로
        안내드립니다.
      </Text>
    </Stack>
  );
}

export function FeedbackScenario() {
  const [email, setEmail] = useState('guest@example.com');
  const [invalidEmail, setInvalidEmail] = useState('guest@');
  const [loading, setLoading] = useState(false);
  return (
    <Stack gap={5}>
      <Heading level={2}>예약 처리</Heading>
      <Grid columns={{minWidth: 280}} gap={4}>
        <TextInput
          label="확인 완료"
          value={email}
          onChange={setEmail}
          status={{type: 'success', message: '연락처를 확인했습니다.'}}
        />
        <TextInput
          label="추가 확인"
          value={email}
          onChange={setEmail}
          status={{
            type: 'warning',
            message: '예약자와 결제자 이름이 다릅니다.',
          }}
        />
        <TextInput
          label="입력 오류"
          value={invalidEmail}
          onChange={setInvalidEmail}
          status={{
            type: 'error',
            message: '올바른 이메일 주소를 입력해주세요.',
          }}
        />
        <TextInput label="읽기 전용" value="YT-2401" isReadOnly />
      </Grid>
      <Banner
        status="info"
        title="예약서 발송 안내"
        description="예약 정보와 연락처를 확인한 뒤 발송해주세요."
      />
      <Stack direction="horizontal" gap={3} wrap="wrap" vAlign="center">
        <Button
          label="예약서 발송"
          isLoading={loading}
          onClick={() => setLoading(true)}
        />
        {loading && (
          <Button
            label="발송 중지"
            variant="ghost"
            onClick={() => setLoading(false)}
          />
        )}
        <Button label="예약 취소" variant="critical" isDisabled />
      </Stack>
      {loading && (
        <Stack gap={3}>
          <Spinner label="예약서를 준비하고 있습니다." />
          <ProgressBar label="발송 준비" isIndeterminate />
        </Stack>
      )}
    </Stack>
  );
}
