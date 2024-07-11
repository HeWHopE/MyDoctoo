import type { Meta, StoryObj } from '@storybook/react';
import DoctorCard from './DoctorCard';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof DoctorCard> = {
  title: 'Components/UI/DoctorCard',
  component: DoctorCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <div className='w-[800px]'>
      <BrowserRouter>
        <DoctorCard>
          <DoctorCard.Image url='https://thispersondoesnotexist.com/' />
          <DoctorCard.Name>John Doe</DoctorCard.Name>
          <DoctorCard.Specializations specializations={[{ id: '1', name: 'Therapist' }]} />
          <DoctorCard.PayrateLabel payrate={75} />
          <DoctorCard.Tags tags={['Top doctor']} />
          <DoctorCard.Rating rating={4.5} reviewsCount={10} doctorId='d8b31236-b72a-4a95-87c5-4e481b5cc895' />
        </DoctorCard>
      </BrowserRouter>
    </div>
  ),
};

export const WithImageFavoriteOverlay: Story = {
  args: {},
  render: () => (
    <div className='w-[800px]'>
      <BrowserRouter>
        <DoctorCard>
          <DoctorCard.ImageWithFavorite isFavorite={false} url='https://thispersondoesnotexist.com/' doctorId='1' />
          <DoctorCard.Name>John Doe</DoctorCard.Name>
          <DoctorCard.Specializations specializations={[{ id: '1', name: 'Therapist' }]} />
          <DoctorCard.PayrateLabel payrate={75} />
          <DoctorCard.Tags tags={['Top doctor']} />
          <DoctorCard.Rating rating={4.5} reviewsCount={10} doctorId='d8b31236-b72a-4a95-87c5-4e481b5cc895' />
        </DoctorCard>
      </BrowserRouter>
    </div>
  ),
};

export const BookMode: Story = {
  args: {},
  render: () => (
    <div className='w-[800px]'>
      <BrowserRouter>
        <DoctorCard>
          <DoctorCard.Image url='https://thispersondoesnotexist.com/' />
          <DoctorCard.Name>John Doe</DoctorCard.Name>
          <DoctorCard.Specializations specializations={[{ id: '1', name: 'Therapist' }]} />
          <DoctorCard.Tags tags={['Top doctor']} />
          <DoctorCard.Rating rating={4.5} reviewsCount={10} doctorId='d8b31236-b72a-4a95-87c5-4e481b5cc895' />
          <DoctorCard.BookButton onClick={() => null} />
        </DoctorCard>
      </BrowserRouter>
    </div>
  ),
};

export const WithTimeSlots: Story = {
  args: {},
  render: () => (
    <div className='w-[800px]'>
      <BrowserRouter>
        <DoctorCard>
          <DoctorCard.Image url='https://thispersondoesnotexist.com/' />
          <DoctorCard.Name>John Doe</DoctorCard.Name>
          <DoctorCard.PayrateLabel payrate={75} />
          <DoctorCard.Specializations specializations={[{ id: '1', name: 'Therapist' }]} />
          <DoctorCard.Tags tags={['Top doctor']} />
          <DoctorCard.Rating rating={4.5} reviewsCount={10} doctorId='d8b31236-b72a-4a95-87c5-4e481b5cc895' />
          <DoctorCard.TimeSlots
            timestamps={[
              dayjs().add(1, 'day').set('hour', 12).set('minute', 0).toDate(),
              dayjs().add(1, 'day').set('hour', 13).set('minute', 0).toDate(),
              dayjs().add(1, 'day').set('hour', 14).set('minute', 0).toDate(),
              dayjs().add(1, 'day').set('hour', 15).set('minute', 0).toDate(),
            ]}
            onClickMore={() => null}
            onClickSlot={i => console.log(i)}
          />
        </DoctorCard>
      </BrowserRouter>
    </div>
  ),
};
