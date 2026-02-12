
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT,
  cuisine TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  delivery_time TEXT,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  min_order NUMERIC(10,2) DEFAULT 0,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active restaurants" ON public.restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage restaurants" ON public.restaurants FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category TEXT DEFAULT 'Main Course',
  is_veg BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  spice_level INTEGER DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage menu items" ON public.menu_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders table
CREATE TYPE public.order_status AS ENUM ('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  restaurant_id UUID REFERENCES public.restaurants(id),
  status order_status NOT NULL DEFAULT 'placed',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 2.99,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_address TEXT,
  notes TEXT,
  rider_name TEXT,
  rider_progress NUMERIC(3,2) DEFAULT 0,
  eta_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
