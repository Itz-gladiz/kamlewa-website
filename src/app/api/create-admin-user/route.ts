import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.' },
        { status: 500 }
      );
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    // Use service role key for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const email = 'admin@kamlewa.org';
    const password = 'Admin123!@#Kamlewa';

<<<<<<< HEAD
    // Check if user already exists and reset password if needed
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
=======
    // Check if user already exists
    const { data: existingUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

>>>>>>> c671d257cb5f28f0e8a34c23db1b6130dcd8ee9f
    if (listError) {
      console.error('Error listing users:', listError);
    } else {
      const existingUser = existingUsers?.users?.find(
        (user) => user.email === email
      );
<<<<<<< HEAD
      
      if (existingUser) {
        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password,
          email_confirm: true,
          user_metadata: {
            role: 'admin',
            name: 'Admin User',
          },
        });

        if (updateError) {
          console.error('Error updating existing user:', updateError);
          return NextResponse.json(
            { error: updateError.message || 'Failed to update existing user' },
            { status: 400 }
          );
        }

=======

      if (userExists) {
>>>>>>> c671d257cb5f28f0e8a34c23db1b6130dcd8ee9f
        return NextResponse.json({
          success: true,
          message: 'User already exists; password reset successfully',
          email,
          userId: existingUser.id,
        });
      }
    }

    // Create user with auto-confirmation
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User',
      },
    });

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      return NextResponse.json({
        success: true,
        message: 'User created and confirmed successfully',
        email,
        userId: data.user.id,
      });
    }

<<<<<<< HEAD
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  } catch (error) {
=======
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  } catch (error: any) {
>>>>>>> c671d257cb5f28f0e8a34c23db1b6130dcd8ee9f
    console.error('Error in create-admin-user API:', error);
    return NextResponse.json(
      { error: (error as any)?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
