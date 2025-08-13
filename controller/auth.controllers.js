import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/authValidator.js";
import {
  getUserByEmail,
  createUser,
  hashPassword,
  comparePassword,
  createAccessToken,
  authenticateUser,
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const parsed = registerUserSchema.safeParse(req.body);

    if (!parsed.success) {
      const errorMessage =
        parsed.error?.errors?.[0]?.message || "Invalid input data";
      return res.status(400).json({ error: errorMessage });
    }

    const { name, email, password, phone } = parsed.data;

    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const userImage = req.file ? req.file.path : null;
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      userImage,
      role: "user",
    });
    await authenticateUser({ req, res, user: newUser, name, email });

    res.status(201).json({
      user: {
        id: newUser.id,
        name,
        email,
        phone,
        role: newUser.role,
        userImage: newUser.userImage,
      },
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { data, error } = loginUserSchema.safeParse(req.body);
    if (error) return res.status(400).json({ error: error.errors[0].message });

    const { email, password } = data;

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isValid = await comparePassword(password, user.password);
    if (!isValid)
      return res.status(401).json({ error: "Invalid email or password" });
    const { accessToken, refreshToken } =  await authenticateUser({ req, res, user });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userImage: user.userImage,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
