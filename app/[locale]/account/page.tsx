"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import { Session } from 'next-auth';

const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const AccountWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
    width: 50%;
  }
`;

const Sidebar = styled.div`
  width: 100%;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  @media (min-width: 768px) {
    width: 250px;
    height: auto;
  }
`;

const SidebarItem = styled.div`
  margin: 15px 0;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  &:hover {
    background-color: #eaeaea;
    border-radius: 5px;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
`;

const AddressSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
    @media (min-width: 1200px) {
    width: 50%;
  }
`;

const AddressItem = styled.div`
  margin-bottom: 10px;

`;

const AddressText = styled.p`
  white-space: normal;
  word-wrap: break-word;
`;

const AddressLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const AddressInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const ScrollableOrders = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 20px;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const ButtonAddress = styled.button`
  background-color: white;
  color: black;
  width: 100%;
  border: 1px solid black;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;


const Button = styled.button`
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const GoldHeader = styled.th`
  color: black;
  padding: 10px;
  border-bottom: 2px solid #ddd;
`;

const GoldCell = styled.td`
  color: black;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
`;

const GoldCellProductName = styled.td`
  color: black;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Params {
  locale: string;
}

interface Order {
  id: number; // Assuming id is a number, change this if it's a string
  product_name: string;
  quantity: number;
  order_date: string; // Adjust this type if the format is different
  status: string;
}

const Account = ({ params }: { params: Params }) => {
  const { locale } = params;
  const { data: session, status } = useSession() as { data: Session | null; status: string };
  const [address, setAddress] = useState({
    name: '',
    surname: '',
    street: '',
    zipcode: '',
    city: '',
    country: '',
    region: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState('orders');
  const router = useRouter();
  const t = useTranslations('account');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/login`);
    } else {
      fetchAddress();
      fetchOrders();
    }
  }, [session, status, locale, router]);

  const fetchAddress = async () => {
    const res = await fetch(`/api/auth/address?email=${encodeURIComponent(session?.user?.email ?? '')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      setAddress(data);
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  const fetchOrders = async () => {
    if (!session?.user?.email) return; // Ensure session and email exist
    const res = await fetch(`/api/auth/orders?email=${encodeURIComponent(session.user.email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': session.user.id,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  const handleChangePassword = () => {
    router.push(`/${locale}/changepassword`);
  };

  const handleEditAddress = () => {
    if (editMode) {
      updateAddress();
    } else {
      setEditMode(true);
    }
  };

  const updateAddress = async () => {
    if (!session) return; // Ensure session is available
    const res = await fetch('/api/auth/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        ...address,
      }),
    });
  
    if (res.ok) {
      setEditMode(false);
      setError(null);
      fetchAddress();
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  if (!session) return null;

  return (
    <OuterContainer>
      <AccountWrapper>
        <Sidebar>
          <SidebarItem onClick={() => setView('orders')}>{t('orders')}</SidebarItem>
          <SidebarItem onClick={() => setView('account')}>{t('accountDetails')}</SidebarItem>
          <SidebarItem onClick={() => setView('settings')}>{t('settings')}</SidebarItem>
        </Sidebar>

        <Content>
          {view === 'account' && (
            <>
              <h1>{t('yourAccount')}</h1>
              <p>{t('yourEmail')}: {session.user.email}</p>
              <SectionTitle>{t('yourAddress')}</SectionTitle>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {editMode ? (
                <AddressSection>
                  <AddressItem>
                    <AddressLabel>{t('name')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      placeholder={t('namePlaceholder')}
                    />
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('surname')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="surname"
                      value={address.surname}
                      onChange={handleChange}
                      placeholder={t('surnamePlaceholder')}
                    />
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('street')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      placeholder={t('streetPlaceholder')}
                    />
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('zipcode')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="zipcode"
                      value={address.zipcode}
                      onChange={handleChange}
                      placeholder={t('zipcodePlaceholder')}
                    />
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('city')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder={t('cityPlaceholder')}
                    />
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('country')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleChange}
                      placeholder={t('countryPlaceholder')}
                    />
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('region')}</AddressLabel>
                    <AddressInput
                      type="text"
                      name="region"
                      value={address.region}
                      onChange={handleChange}
                      placeholder={t('regionPlaceholder')}
                    />
                  </AddressItem>
                  <Button onClick={updateAddress}>{t('saveAddress')}</Button>
                  <Button onClick={() => setEditMode(false)}>{t('cancel')}</Button>
                </AddressSection>
              ) : (
                <AddressSection>
                  <AddressItem>
                    <AddressLabel>{t('name')}</AddressLabel>
                    <AddressText>{address.name}</AddressText>
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('surname')}</AddressLabel>
                    <AddressText>{address.surname}</AddressText>
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('street')}</AddressLabel>
                    <AddressText>{address.street}</AddressText>
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('zipcode')}</AddressLabel>
                    <AddressText>{address.zipcode}</AddressText>
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('city')}</AddressLabel>
                    <AddressText>{address.city}</AddressText>
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('country')}</AddressLabel>
                    <AddressText>{address.country}</AddressText>
                  </AddressItem>
                  <AddressItem>
                    <AddressLabel>{t('region')}</AddressLabel>
                    <AddressText>{address.region}</AddressText>
                  </AddressItem>
                  <ButtonAddress onClick={handleEditAddress}>
                    {address.street ? t('editAddress') : t('addAddress')}
                  </ButtonAddress>
                </AddressSection>
              )}
            </>
          )}

          {view === 'orders' && (
            <>
              <SectionTitle>{t('yourOrders')}</SectionTitle>
              {orders.length > 0 ? (
                <ScrollableOrders>
                  <OrdersTable>
                    <thead>
                      <tr>
                        <GoldHeader>{t('orderId')}</GoldHeader>
                        <GoldHeader>{t('productName')}</GoldHeader>
                        <GoldHeader>{t('quantity')}</GoldHeader>
                        <GoldHeader>{t('orderDate')}</GoldHeader>
                        <GoldHeader>{t('status')}</GoldHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <GoldCell data-label={t('orderId')}>{order.id}</GoldCell>
                          <GoldCellProductName data-label={t('productName')}>
                            {order.product_name}
                          </GoldCellProductName>
                          <GoldCell data-label={t('quantity')}>{order.quantity}</GoldCell>
                          <GoldCell data-label={t('orderDate')}>
                            {order.order_date
                              ? new Date(order.order_date.replace(' ', 'T')).toLocaleDateString()
                              : 'N/A'}
                          </GoldCell>
                          <GoldCell data-label={t('status')}>{order.status}</GoldCell>
                        </tr>
                      ))}
                    </tbody>
                  </OrdersTable>
                </ScrollableOrders>
              ) : (
                <p>{t('noOrdersFound')}</p>
              )}
            </>
          )}

          {view === 'settings' && (
            <>
              <SectionTitle>{t('settings')}</SectionTitle>
              <Button onClick={handleLogout}>{t('logOut')}</Button>
              <Button onClick={handleChangePassword}>{t('changePassword')}</Button>
            </>
          )}
        </Content>
      </AccountWrapper>
    </OuterContainer>
  );
};

export default Account;
