import { MdAccountCircle } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import {
    Avatar,
    Card,
    IconButton,
    Tooltip,
    Typography,
    Drawer,
    Button,
    Select,
    Option,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Name", "Email", ""];
export default function Dashboard() {
    const { customers } = usePage().props;

    console.log(customers);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="bg-white overflow-y-auto max-h-[550px]">
                <div className="mt-5 px-4">Welcome</div>
            </div>
        </AuthenticatedLayout>
    );
}
